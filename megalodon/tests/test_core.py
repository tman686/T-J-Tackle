"""End-to-end tests over the active native backend (ctypes or pybind11)."""
import math

import pytest

from megalodon import core, bridge


def test_version_matches_package():
    assert core.version() == "0.1.0"


def test_backend_is_native():
    core.version()  # force load
    assert bridge.active_backend() in {"ctypes", "pybind11"}


def test_sum_and_mean():
    data = [1.0, 2.0, 3.0, 4.0]
    assert core.total(data) == pytest.approx(10.0)
    assert core.mean(data) == pytest.approx(2.5)


def test_mean_empty_is_zero():
    assert core.mean([]) == 0.0


def test_fingerprint_is_deterministic_and_nonzero():
    a = core.fingerprint("T&J's Tackle")
    b = core.fingerprint("T&J's Tackle")
    c = core.fingerprint("something else")
    assert a == b
    assert a != c
    assert a > 0


def test_ema_bounds():
    series = [10, 12, 11, 13, 15]
    e = core.forecast_ema(series, alpha=0.5)
    assert min(series) <= e <= max(series)


def test_engine_summary():
    with core.Engine("test") as eng:
        eng.observe([5.0, 1.0, 9.0])
        s = eng.summary()
    assert s["count"] == 3
    assert s["total"] == pytest.approx(15.0)
    assert s["min"] == 1.0
    assert s["max"] == 9.0
    assert s["average"] == pytest.approx(5.0)


def test_engine_reset():
    eng = core.Engine()
    eng.observe([1.0, 2.0])
    eng.reset()
    assert eng.count == 0
    eng.close()
