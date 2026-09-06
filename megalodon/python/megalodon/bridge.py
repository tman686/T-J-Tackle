"""Binding/Bridge Layer — the fork in the Megalodon dependency tree.

Loading strategy, in order:

  OPTION B  pybind11 native extension ``megalodon._megalodon`` (if compiled)
  OPTION A  ctypes over the plain C-ABI shared library ``libmegalodon.{so,dylib,dll}``

Either way the rest of the package talks to one uniform ``Backend`` object, so
callers never care which path is live. ``active_backend()`` reports which loaded.
"""
from __future__ import annotations

import ctypes
import os
import sys
from pathlib import Path
from typing import Iterable, List, Optional

_BACKEND_NAME = "uninitialized"


def _lib_filename() -> str:
    if sys.platform.startswith("win"):
        return "megalodon.dll"
    if sys.platform == "darwin":
        return "libmegalodon.dylib"
    return "libmegalodon.so"


def _candidate_paths() -> List[Path]:
    """Where to look for the ctypes shared library."""
    name = _lib_filename()
    paths: List[Path] = []
    env = os.environ.get("MEGALODON_LIB")
    if env:
        paths.append(Path(env))
    here = Path(__file__).resolve().parent
    root = here.parent.parent  # megalodon/
    paths += [
        root / "build" / name,
        here / name,
        root / name,
    ]
    return paths


class _CtypesBackend:
    """OPTION A — POD-only C ABI via ctypes. No third-party build deps."""

    def __init__(self, lib_path: Path) -> None:
        self._lib_path = str(lib_path)
        lib = ctypes.CDLL(str(lib_path))
        self._lib = lib

        lib.mega_version.restype = ctypes.c_char_p
        lib.mega_fingerprint.restype = ctypes.c_ulonglong
        lib.mega_fingerprint.argtypes = [ctypes.c_char_p, ctypes.c_ulonglong]
        for fn in ("mega_sum", "mega_mean"):
            f = getattr(lib, fn)
            f.restype = ctypes.c_double
            f.argtypes = [ctypes.POINTER(ctypes.c_double), ctypes.c_ulonglong]
        lib.mega_ema.restype = ctypes.c_double
        lib.mega_ema.argtypes = [ctypes.POINTER(ctypes.c_double), ctypes.c_ulonglong, ctypes.c_double]

        lib.mega_engine_new.restype = ctypes.c_void_p
        lib.mega_engine_new.argtypes = [ctypes.c_char_p]
        lib.mega_engine_free.argtypes = [ctypes.c_void_p]
        lib.mega_engine_observe.argtypes = [ctypes.c_void_p, ctypes.POINTER(ctypes.c_double), ctypes.c_ulonglong]
        lib.mega_engine_count.restype = ctypes.c_ulonglong
        lib.mega_engine_count.argtypes = [ctypes.c_void_p]
        for fn in ("mega_engine_total", "mega_engine_min", "mega_engine_max", "mega_engine_average"):
            f = getattr(lib, fn)
            f.restype = ctypes.c_double
            f.argtypes = [ctypes.c_void_p]
        lib.mega_engine_reset.argtypes = [ctypes.c_void_p]

    @staticmethod
    def _buf(data: Iterable[float]):
        seq = list(data)
        arr = (ctypes.c_double * len(seq))(*seq)
        return arr, len(seq)

    def version(self) -> str:
        return self._lib.mega_version().decode()

    def fingerprint(self, data: str) -> int:
        raw = data.encode("utf-8")
        return int(self._lib.mega_fingerprint(raw, len(raw)))

    def sum(self, data: Iterable[float]) -> float:
        arr, n = self._buf(data)
        return float(self._lib.mega_sum(arr, n))

    def mean(self, data: Iterable[float]) -> float:
        arr, n = self._buf(data)
        return float(self._lib.mega_mean(arr, n))

    def ema(self, data: Iterable[float], alpha: float = 0.5) -> float:
        arr, n = self._buf(data)
        return float(self._lib.mega_ema(arr, n, alpha))

    # Engine handle wrapper.
    def engine_new(self, name: str) -> int:
        return int(self._lib.mega_engine_new(name.encode()))

    def engine_free(self, h: int) -> None:
        self._lib.mega_engine_free(ctypes.c_void_p(h))

    def engine_observe(self, h: int, data: Iterable[float]) -> None:
        arr, n = self._buf(data)
        self._lib.mega_engine_observe(ctypes.c_void_p(h), arr, n)

    def engine_stat(self, h: int, stat: str) -> float:
        return float(getattr(self._lib, f"mega_engine_{stat}")(ctypes.c_void_p(h)))

    def engine_count(self, h: int) -> int:
        return int(self._lib.mega_engine_count(ctypes.c_void_p(h)))

    def engine_reset(self, h: int) -> None:
        self._lib.mega_engine_reset(ctypes.c_void_p(h))


class _Pybind11Backend:
    """OPTION B — thin adapter over the compiled pybind11 module."""

    def __init__(self, mod) -> None:
        self._m = mod
        self._engines = {}
        self._next = 1

    def version(self) -> str:
        return self._m.version()

    def fingerprint(self, data: str) -> int:
        return int(self._m.fingerprint(data))

    def sum(self, data: Iterable[float]) -> float:
        return float(self._m.sum(list(data)))

    def mean(self, data: Iterable[float]) -> float:
        return float(self._m.mean(list(data)))

    def ema(self, data: Iterable[float], alpha: float = 0.5) -> float:
        return float(self._m.ema(list(data), alpha))

    def engine_new(self, name: str) -> int:
        h = self._next
        self._next += 1
        self._engines[h] = self._m.Engine(name)
        return h

    def engine_free(self, h: int) -> None:
        self._engines.pop(h, None)

    def engine_observe(self, h: int, data: Iterable[float]) -> None:
        self._engines[h].observe(list(data))

    def engine_stat(self, h: int, stat: str) -> float:
        e = self._engines[h]
        return float(getattr(e, {"total": "total", "min": "minimum", "max": "maximum", "average": "average"}[stat]))

    def engine_count(self, h: int) -> int:
        return int(self._engines[h].count)

    def engine_reset(self, h: int) -> None:
        self._engines[h].reset()


_backend = None


def load_backend(prefer: Optional[str] = None):
    """Load the best available backend. ``prefer`` may be 'ctypes' or 'pybind11'."""
    global _backend, _BACKEND_NAME
    if _backend is not None and prefer is None:
        return _backend

    if prefer != "ctypes":
        try:
            from . import _megalodon  # type: ignore

            _backend = _Pybind11Backend(_megalodon)
            _BACKEND_NAME = "pybind11"
            return _backend
        except Exception:
            if prefer == "pybind11":
                raise

    for p in _candidate_paths():
        if p.exists():
            _backend = _CtypesBackend(p)
            _BACKEND_NAME = "ctypes"
            return _backend

    searched = ", ".join(str(p) for p in _candidate_paths())
    raise RuntimeError(
        "Megalodon native library not found and pybind11 extension not built.\n"
        f"Build it with `make` (from the megalodon/ dir) or set MEGALODON_LIB.\n"
        f"Searched: {searched}"
    )


def active_backend() -> str:
    return _BACKEND_NAME
