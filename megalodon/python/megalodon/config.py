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
from typing import List, Optional


@dataclass
class CogniPrimeConfig:
    # Base URL of your local CogniPrime (Ollama-compatible) instance. Defaults to
    # Ollama's standard local address. Blank it to force OFFLINE mode.
    endpoint: str = "http://127.0.0.1:11434"
    # Optional bearer token your CogniPrime instance expects.
    token: str = ""
    # Default model name to use when a call doesn't specify one. Empty = auto-pick
    # the first model CogniPrime reports from /api/tags.
    model: str = ""
    # Request timeout, seconds.
    timeout: float = 30.0
    # Logical name for this Megalodon node.
    node_name: str = "megalodon"


@dataclass
class SSHHost:
    """One machine you administer over standard OpenSSH (key-based auth)."""
    name: str                       # friendly label, e.g. "kali"
    hostname: str                   # IP or DNS name
    user: str = "root"
    port: int = 22
    key: str = ""                   # path to a private key; "" uses ssh-agent / ~/.ssh/config
    shell: str = "bash"             # "bash" for Linux, "powershell" for Windows OpenSSH
    enabled: bool = True


@dataclass
class FleetConfig:
    # Fail fast instead of hanging on a prompt: OpenSSH BatchMode + a connect timeout.
    connect_timeout: int = 10
    hosts: List[SSHHost] = field(default_factory=list)


@dataclass
class Config:
    prefer_backend: Optional[str] = None  # None | "ctypes" | "pybind11"
    cogniprime: CogniPrimeConfig = field(default_factory=CogniPrimeConfig)
    fleet: FleetConfig = field(default_factory=FleetConfig)


def _parse_fleet(data: dict) -> FleetConfig:
    f = data.get("fleet", {}) if isinstance(data, dict) else {}
    hosts = []
    for h in f.get("hosts", []):
        if not h.get("name") or not h.get("hostname"):
            continue
        hosts.append(
            SSHHost(
                name=str(h["name"]),
                hostname=str(h["hostname"]),
                user=str(h.get("user", "root")),
                port=int(h.get("port", 22)),
                key=str(h.get("key", "")),
                shell=str(h.get("shell", "bash")),
                enabled=bool(h.get("enabled", True)),
            )
        )
    return FleetConfig(connect_timeout=int(f.get("connect_timeout", 10)), hosts=hosts)


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
        endpoint=os.environ.get("COGNIPRIME_ENDPOINT", cp.get("endpoint", "http://127.0.0.1:11434")),
        token=os.environ.get("COGNIPRIME_TOKEN", cp.get("token", "")),
        model=os.environ.get("COGNIPRIME_MODEL", cp.get("model", "")),
        timeout=float(os.environ.get("COGNIPRIME_TIMEOUT", cp.get("timeout", 30.0))),
        node_name=os.environ.get("MEGALODON_NODE_NAME", cp.get("node_name", "megalodon")),
    )
    cfg.fleet = _parse_fleet(data if isinstance(data, dict) else {})
    return cfg
