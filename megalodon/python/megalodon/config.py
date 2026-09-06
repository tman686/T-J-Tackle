"""Configuration for Megalodon and its CogniPrime integration.

Values resolve from (highest priority first): environment variables, an optional
JSON config file (path in MEGALODON_CONFIG, else ./megalodon.json), then
built-in defaults. Nothing is hard-coded to a remote host — the CogniPrime
endpoint is blank until *you* set it when you set CogniPrime up.
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


@dataclass
class CogniPrimeConfig:
    # Base URL of your local CogniPrime instance, e.g. "http://127.0.0.1:8080".
    # Empty means "not configured" → the client runs in offline mode.
    endpoint: str = ""
    # Optional bearer token your CogniPrime instance expects.
    token: str = ""
    # Request timeout, seconds.
    timeout: float = 5.0
    # Logical name this Megalodon node reports to CogniPrime.
    node_name: str = "megalodon"


@dataclass
class Config:
    prefer_backend: Optional[str] = None  # None | "ctypes" | "pybind11"
    cogniprime: CogniPrimeConfig = field(default_factory=CogniPrimeConfig)


def _load_file() -> dict:
    path = os.environ.get("MEGALODON_CONFIG")
    p = Path(path) if path else Path("megalodon.json")
    if p.exists():
        try:
            return json.loads(p.read_text())
        except Exception:
            return {}
    return {}


def load_config() -> Config:
    data = _load_file()
    cp = data.get("cogniprime", {}) if isinstance(data, dict) else {}

    cfg = Config()
    cfg.prefer_backend = os.environ.get("MEGALODON_BACKEND", data.get("prefer_backend")) or None
    cfg.cogniprime = CogniPrimeConfig(
        endpoint=os.environ.get("COGNIPRIME_ENDPOINT", cp.get("endpoint", "")),
        token=os.environ.get("COGNIPRIME_TOKEN", cp.get("token", "")),
        timeout=float(os.environ.get("COGNIPRIME_TIMEOUT", cp.get("timeout", 5.0))),
        node_name=os.environ.get("MEGALODON_NODE_NAME", cp.get("node_name", "megalodon")),
    )
    return cfg
