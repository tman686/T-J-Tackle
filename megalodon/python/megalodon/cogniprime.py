"""CogniPrime integration client.

CogniPrime is an Ollama-compatible local LLM server (a remake of Ollama). This
client speaks that HTTP API so Megalodon can list models and run prompts against
whatever CogniPrime is serving on your machine.

Design principles (unchanged):
  * Talks ONLY to the endpoint you configure. Default is Ollama's local address
    (http://127.0.0.1:11434); override with COGNIPRIME_ENDPOINT. If you blank the
    endpoint it goes OFFLINE — every call is a logged local no-op, nothing leaves
    the machine.
  * Standard library only (urllib). Every request is logged at INFO.

Ollama-compatible routes used:
    GET  /api/tags        -> list installed models (also used as a health probe)
    POST /api/generate    -> single-prompt completion  {model, prompt, stream:false}
    POST /api/chat        -> chat completion            {model, messages, stream:false}
"""
from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional

from .config import CogniPrimeConfig
from .version import __version__

log = logging.getLogger("megalodon.cogniprime")


class CogniPrimeClient:
    def __init__(self, config: CogniPrimeConfig) -> None:
        self.config = config

    @property
    def offline(self) -> bool:
        return not self.config.endpoint

    def _request(self, method: str, path: str, payload: Optional[Dict[str, Any]] = None) -> Optional[dict]:
        if self.offline:
            log.info("[offline] would %s %s payload=%s", method, path, payload)
            return None
        url = self.config.endpoint.rstrip("/") + path
        data = json.dumps(payload).encode() if payload is not None else None
        req = urllib.request.Request(url, data=data, method=method)
        req.add_header("Content-Type", "application/json")
        req.add_header("User-Agent", f"megalodon/{__version__}")
        if self.config.token:
            req.add_header("Authorization", f"Bearer {self.config.token}")
        log.info("%s %s", method, url)
        try:
            with urllib.request.urlopen(req, timeout=self.config.timeout) as resp:
                body = resp.read().decode()
                return json.loads(body) if body else {}
        except urllib.error.URLError as e:
            log.warning("CogniPrime request failed: %s", e)
            return None
        except json.JSONDecodeError as e:
            log.warning("CogniPrime returned non-JSON: %s", e)
            return None

    # --- Ollama-compatible surface ---

    def list_models(self) -> List[str]:
        """Names of models CogniPrime currently serves ([] if unreachable)."""
        resp = self._request("GET", "/api/tags")
        if not resp:
            return []
        return [m.get("name", "") for m in resp.get("models", []) if m.get("name")]

    def health(self) -> bool:
        """True if the configured CogniPrime instance answers."""
        if self.offline:
            return False
        return self._request("GET", "/api/tags") is not None

    def _resolve_model(self, model: Optional[str]) -> Optional[str]:
        if model:
            return model
        if self.config.model:
            return self.config.model
        available = self.list_models()
        return available[0] if available else None

    def generate(self, prompt: str, model: Optional[str] = None) -> Optional[str]:
        """Run a single-prompt completion; returns the text or None if offline/unreachable."""
        if self.offline:
            log.info("CogniPrime endpoint not configured — cannot generate (offline).")
            return None
        m = self._resolve_model(model)
        if not m:
            log.warning("No model available on CogniPrime to generate with.")
            return None
        resp = self._request("POST", "/api/generate", {"model": m, "prompt": prompt, "stream": False})
        return resp.get("response") if resp else None

    def chat(self, messages: List[Dict[str, str]], model: Optional[str] = None) -> Optional[str]:
        """Run a chat completion over a list of {role, content} messages."""
        if self.offline:
            log.info("CogniPrime endpoint not configured — cannot chat (offline).")
            return None
        m = self._resolve_model(model)
        if not m:
            log.warning("No model available on CogniPrime to chat with.")
            return None
        resp = self._request("POST", "/api/chat", {"model": m, "messages": messages, "stream": False})
        if not resp:
            return None
        return (resp.get("message") or {}).get("content")

    def connect(self) -> bool:
        """Verify CogniPrime is reachable and report the models it serves."""
        if self.offline:
            log.info("CogniPrime endpoint not configured — running standalone (offline).")
            return False
        ok = self.health()
        if ok:
            log.info("Connected to CogniPrime at %s; models: %s",
                     self.config.endpoint, ", ".join(self.list_models()) or "(none)")
        return ok
