"""CogniPrime client behaves safely when unconfigured (offline)."""
from megalodon.cogniprime import CogniPrimeClient
from megalodon.config import CogniPrimeConfig


def test_offline_when_no_endpoint():
    c = CogniPrimeClient(CogniPrimeConfig(endpoint=""))
    assert c.offline is True
    assert c.health() is False
    assert c.connect() is False          # no-op, no network
    assert c.send_event("k", {"x": 1}) is False


def test_not_offline_when_endpoint_set():
    c = CogniPrimeClient(CogniPrimeConfig(endpoint="http://127.0.0.1:9"))
    assert c.offline is False
