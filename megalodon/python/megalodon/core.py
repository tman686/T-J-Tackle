"""High-level, Pythonic API over whichever native backend loaded.

This is the layer application code should import. It hides handle management and
backend differences behind clean objects and functions.
"""
from __future__ import annotations

from typing import Iterable, List

from . import bridge


def version() -> str:
    return bridge.load_backend().version()


def fingerprint(data: str) -> int:
    return bridge.load_backend().fingerprint(data)


def total(data: Iterable[float]) -> float:
    return bridge.load_backend().sum(data)


def mean(data: Iterable[float]) -> float:
    return bridge.load_backend().mean(data)


def forecast_ema(series: Iterable[float], alpha: float = 0.5) -> float:
    """Next-period estimate via exponential moving average (delegates to C++)."""
    return bridge.load_backend().ema(series, alpha)


class Engine:
    """RAII wrapper around a native engine handle.

    Works identically whether the ctypes or pybind11 backend is active.
    """

    def __init__(self, name: str = "megalodon") -> None:
        self._b = bridge.load_backend()
        self._h = self._b.engine_new(name)
        self._name = name
        self._closed = False

    def observe(self, data: Iterable[float]) -> "Engine":
        self._b.engine_observe(self._h, data)
        return self

    @property
    def name(self) -> str:
        return self._name

    @property
    def count(self) -> int:
        return self._b.engine_count(self._h)

    @property
    def total(self) -> float:
        return self._b.engine_stat(self._h, "total")

    @property
    def minimum(self) -> float:
        return self._b.engine_stat(self._h, "min")

    @property
    def maximum(self) -> float:
        return self._b.engine_stat(self._h, "max")

    @property
    def average(self) -> float:
        return self._b.engine_stat(self._h, "average")

    def summary(self) -> dict:
        return {
            "name": self._name,
            "count": self.count,
            "total": self.total,
            "min": self.minimum,
            "max": self.maximum,
            "average": self.average,
            "backend": bridge.active_backend(),
        }

    def reset(self) -> None:
        self._b.engine_reset(self._h)

    def close(self) -> None:
        if not self._closed:
            self._b.engine_free(self._h)
            self._closed = True

    def __enter__(self) -> "Engine":
        return self

    def __exit__(self, *exc) -> None:
        self.close()

    def __del__(self) -> None:  # best-effort cleanup
        try:
            self.close()
        except Exception:
            pass
