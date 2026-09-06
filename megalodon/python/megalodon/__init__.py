"""Megalodon — a Python application over a compiled C++ core, with a pluggable
CogniPrime integration.

Dependency tree (top → bottom):
    app.py  →  core.py  →  bridge.py  →  { pybind11 _megalodon  |  ctypes libmegalodon }  →  C++ core
    app.py  →  cogniprime.py  →  (your local CogniPrime instance, when configured)
"""
from .version import __version__
from . import core, bridge
from .core import Engine, version, fingerprint, total, mean, forecast_ema
from .cogniprime import CogniPrimeClient
from .config import load_config

__all__ = [
    "__version__",
    "core",
    "bridge",
    "Engine",
    "version",
    "fingerprint",
    "total",
    "mean",
    "forecast_ema",
    "CogniPrimeClient",
    "load_config",
]
