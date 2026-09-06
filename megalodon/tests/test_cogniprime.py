"""CogniPrime (Ollama-compatible) client behaves safely when offline."""
from megalodon.cogniprime import CogniPrimeClient
from megalodon.config import CogniPrimeConfig


def test_offline_when_endpoint_blank():
    c = CogniPrimeClient(CogniPrimeConfig(endpoint=""))
    assert c.offline is True
    assert c.health() is False
    assert c.connect() is False           # no-op, no network
    assert c.list_models() == []
    assert c.generate("hello") is None    # offline → None, no request made
    assert c.chat([{"role": "user", "content": "hi"}]) is None


def test_not_offline_when_endpoint_set():
    c = CogniPrimeClient(CogniPrimeConfig(endpoint="http://127.0.0.1:11434"))
    assert c.offline is False


def test_unreachable_endpoint_is_handled(monkeypatch):
    # Point at a closed port; requests should fail gracefully, not raise.
    c = CogniPrimeClient(CogniPrimeConfig(endpoint="http://127.0.0.1:1", timeout=0.2))
    assert c.health() is False
    assert c.list_models() == []
    assert c.generate("hello") is None
