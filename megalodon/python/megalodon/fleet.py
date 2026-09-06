"""Fleet control over standard OpenSSH.

A thin, auditable wrapper around the system ``ssh`` client for administering
*your own* machines (Kali, Ubuntu, Windows-with-OpenSSH) from one place. It is
deliberately boring and transparent:

  * It shells out to the real ``ssh`` binary — no custom protocol, no persistence,
    no attempt to hide. You could type every command it runs by hand.
  * Key-based auth only: it passes ``BatchMode=yes`` so ssh never silently prompts
    for or stores a password. If your key/agent isn't set up, it fails with a
    clear error instead of hanging. Set up keys the normal way (``ssh-copy-id``).
  * Host-key checking is left at OpenSSH defaults (your ``~/.ssh/known_hosts``
    governs) — it does not weaken your SSH security.
  * subprocess is invoked with an argument list (never ``shell=True``), so the
    remote command is passed as one argv element.

This is the same shape as Ansible ad-hoc or Fabric: legitimate remote admin.
"""
from __future__ import annotations

import logging
import shlex
import subprocess
from dataclasses import dataclass
from typing import List, Optional

from .config import FleetConfig, SSHHost

log = logging.getLogger("megalodon.fleet")


@dataclass
class RunResult:
    host: str
    ok: bool
    returncode: int
    stdout: str
    stderr: str

    def as_dict(self) -> dict:
        return {
            "host": self.host,
            "ok": self.ok,
            "returncode": self.returncode,
            "stdout": self.stdout,
            "stderr": self.stderr,
        }


def _wrap_for_shell(host: SSHHost, command: str) -> str:
    """Wrap the command for the remote shell. Windows OpenSSH → PowerShell."""
    if host.shell.lower() in {"powershell", "pwsh"}:
        # -NoProfile keeps it predictable; the command is a single quoted arg.
        return f'powershell -NoProfile -NonInteractive -Command {shlex.quote(command)}'
    return command  # Linux/macOS: ssh runs it through the login shell as-is.


def build_ssh_argv(host: SSHHost, command: str, connect_timeout: int = 10) -> List[str]:
    """Construct the exact ``ssh`` argv used to run ``command`` on ``host``."""
    argv = ["ssh"]
    if host.port and host.port != 22:
        argv += ["-p", str(host.port)]
    if host.key:
        argv += ["-i", host.key]
    argv += [
        "-o", "BatchMode=yes",
        "-o", f"ConnectTimeout={connect_timeout}",
        f"{host.user}@{host.hostname}",
        _wrap_for_shell(host, command),
    ]
    return argv


class Fleet:
    def __init__(self, config: FleetConfig) -> None:
        self.config = config

    def hosts(self, include_disabled: bool = False) -> List[SSHHost]:
        return [h for h in self.config.hosts if include_disabled or h.enabled]

    def get(self, name: str) -> Optional[SSHHost]:
        for h in self.config.hosts:
            if h.name == name:
                return h
        return None

    def run(self, host: SSHHost, command: str, timeout: float = 60.0) -> RunResult:
        argv = build_ssh_argv(host, command, self.config.connect_timeout)
        log.info("run on %s: %s", host.name, " ".join(shlex.quote(a) for a in argv))
        try:
            proc = subprocess.run(
                argv, capture_output=True, text=True, timeout=timeout, check=False
            )
            return RunResult(
                host=host.name,
                ok=(proc.returncode == 0),
                returncode=proc.returncode,
                stdout=proc.stdout.strip(),
                stderr=proc.stderr.strip(),
            )
        except FileNotFoundError:
            return RunResult(host.name, False, 127, "", "ssh client not found on this machine")
        except subprocess.TimeoutExpired:
            return RunResult(host.name, False, 124, "", f"timed out after {timeout}s")

    def check(self, host: SSHHost) -> RunResult:
        """Cheap connectivity/auth probe."""
        probe = "$PSVersionTable.PSVersion.ToString()" if host.shell.lower().startswith(("power", "pwsh")) else "echo ok"
        return self.run(host, probe, timeout=self.config.connect_timeout + 5)

    def run_all(self, command: str, timeout: float = 60.0) -> List[RunResult]:
        return [self.run(h, command, timeout=timeout) for h in self.hosts()]
