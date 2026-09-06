"""CogniPrime integration client.

This is the bridge from Megalodon to a CogniPrime instance running on your
machine. It is deliberately simple and transparent:

  * It only talks to the endpoint you put in config (COGNIPRIME_ENDPOINT or
    megalodon.json). Until you set that up, the client is in OFFLINE mode and
    every call is a local no-op that is logged — nothing leaves the machine.
  * It uses only the Python standard library (urllib) over plain HTTP(S).
  * Every request is logged at INFO so you can see exactly what is sent.

The protocol assumed here is a minimal JSON/HTTP one (GET /health,
POST /v1/register, POST /v1/events). If your CogniPrime setup speaks something
different (a Unix socket, gRPC, a message queue), tell me the shape and this is
the single file to adapt — nothing else in Megalodon changes.
"""
from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from typing import Any, Dict, Optional

from .config import CogniPrimeConfig
from .version import __version__

log = logging.getLogger("megalodon.cogniprime")


class CogniPrimeClient:
    def __init__(self, config: CogniPrimeConfig) -> None:
        self.config = config
        self._connected = False

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

    def health(self) -> bool:
        """Return True if the configured CogniPrime instance answers."""
        if self.offline:
            return False
        return self._request("GET", "/health") is not None

    def connect(self) -> bool:
        """Register this Megalodon node with CogniPrime. Safe to call repeatedly."""
        if self.offline:
            log.info("CogniPrime endpoint not configured — running standalone (offline).")
            return False
        resp = self._request(
            "POST",
            "/v1/register",
            {"node": self.config.node_name, "role": "megalodon-core", "version": __version__},
        )
        self._connected = resp is not None
        if self._connected:
            log.info("Registered '%s' with CogniPrime at %s", self.config.node_name, self.config.endpoint)
        return self._connected

    def send_event(self, kind: str, data: Dict[str, Any]) -> bool:
        """Send one structured event to CogniPrime (e.g. a computed summary)."""
        resp = self._request(
            "POST",
            "/v1/events",
            {"node": self.config.node_name, "kind": kind, "data": data},
        )
        return resp is not None

    @property
    def connected(self) -> bool:
        return self._connected
