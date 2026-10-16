"""Main Python application — the top node of the dependency tree.

Wires the compiled C++ core (through the bridge) to the CogniPrime client and
exposes a small CLI so you can see the whole stack working end to end:

  python -m megalodon --status
  python -m megalodon compute 12 8 5 9 14
  python -m megalodon connect
"""
from __future__ import annotations

import argparse
import json
import logging
import sys
from typing import List

from . import bridge, core
from .cogniprime import CogniPrimeClient
from .config import load_config
from .fleet import Fleet
from .version import __version__


def _setup_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.INFO if verbose else logging.WARNING,
        format="%(levelname)s %(name)s: %(message)s",
    )


def cmd_status(cfg) -> dict:
    backend = bridge.load_backend(cfg.prefer_backend)
    client = CogniPrimeClient(cfg.cogniprime)
    online = client.health()
    return {
        "megalodon": __version__,
        "core_version": backend.version(),
        "backend": bridge.active_backend(),
        "cogniprime_endpoint": cfg.cogniprime.endpoint or "(offline)",
        "cogniprime_online": online,
        "cogniprime_models": client.list_models() if online else [],
    }


def cmd_compute(cfg, numbers: List[float]) -> dict:
    with core.Engine(cfg.cogniprime.node_name) as eng:
        eng.observe(numbers)
        summary = eng.summary()
    summary["ema_forecast"] = core.forecast_ema(numbers, alpha=0.5)
    summary["fingerprint"] = core.fingerprint(",".join(str(n) for n in numbers))
    return summary


def cmd_connect(cfg) -> dict:
    client = CogniPrimeClient(cfg.cogniprime)
    ok = client.connect()
    return {
        "configured": not client.offline,
        "connected": ok,
        "endpoint": cfg.cogniprime.endpoint or "(offline)",
        "models": client.list_models() if ok else [],
    }


def cmd_ask(cfg, prompt: str, model) -> dict:
    """Run a prompt against the model CogniPrime is serving."""
    client = CogniPrimeClient(cfg.cogniprime)
    answer = client.generate(prompt, model=model)
    return {
        "endpoint": cfg.cogniprime.endpoint or "(offline)",
        "model": model or cfg.cogniprime.model or "(auto)",
        "prompt": prompt,
        "response": answer,
        "ok": answer is not None,
    }


def cmd_hosts(cfg) -> dict:
    fleet = Fleet(cfg.fleet)
    return {
        "hosts": [
            {"name": h.name, "target": f"{h.user}@{h.hostname}:{h.port}", "shell": h.shell, "enabled": h.enabled}
            for h in fleet.hosts(include_disabled=True)
        ]
    }


def cmd_check(cfg, name) -> dict:
    fleet = Fleet(cfg.fleet)
    hosts = [fleet.get(name)] if name else fleet.hosts()
    if name and hosts[0] is None:
        return {"error": f"no host named '{name}' in config"}
    return {"results": [fleet.check(h).as_dict() for h in hosts if h]}


def cmd_run_on(cfg, name, command) -> dict:
    fleet = Fleet(cfg.fleet)
    host = fleet.get(name)
    if host is None:
        return {"error": f"no host named '{name}' in config"}
    return fleet.run(host, command).as_dict()


def cmd_run_all(cfg, command) -> dict:
    fleet = Fleet(cfg.fleet)
    return {"results": [r.as_dict() for r in fleet.run_all(command)]}


def main(argv=None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    parser = argparse.ArgumentParser(prog="megalodon", description="Megalodon C++/Python core with CogniPrime integration.")
    parser.add_argument("-v", "--verbose", action="store_true", help="log requests and backend detail")
    parser.add_argument("--status", action="store_true", help="print stack + CogniPrime status and exit")
    sub = parser.add_subparsers(dest="command")

    p_compute = sub.add_parser("compute", help="run the C++ core over numbers")
    p_compute.add_argument("numbers", nargs="+", type=float)

    sub.add_parser("connect", help="verify the connection to CogniPrime and list its models")

    p_ask = sub.add_parser("ask", help="run a prompt against CogniPrime's model")
    p_ask.add_argument("prompt")
    p_ask.add_argument("--model", default=None, help="model name (default: config, else auto)")

    # --- Fleet (SSH) commands: administer your own machines over OpenSSH ---
    sub.add_parser("hosts", help="list configured SSH hosts")

    p_check = sub.add_parser("check", help="test SSH connectivity (one host, or all)")
    p_check.add_argument("host", nargs="?", default=None)

    p_ron = sub.add_parser("run-on", help="run a command on one SSH host")
    p_ron.add_argument("host")
    p_ron.add_argument("remote_command", metavar="command")

    p_rall = sub.add_parser("run-all", help="run a command on every enabled SSH host")
    p_rall.add_argument("remote_command", metavar="command")

    args = parser.parse_args(argv)
    _setup_logging(args.verbose)
    cfg = load_config()

    try:
        if args.status or not args.command:
            result = cmd_status(cfg)
        elif args.command == "compute":
            result = cmd_compute(cfg, args.numbers)
        elif args.command == "connect":
            result = cmd_connect(cfg)
        elif args.command == "ask":
            result = cmd_ask(cfg, args.prompt, args.model)
        elif args.command == "hosts":
            result = cmd_hosts(cfg)
        elif args.command == "check":
            result = cmd_check(cfg, args.host)
        elif args.command == "run-on":
            result = cmd_run_on(cfg, args.host, args.remote_command)
        elif args.command == "run-all":
            result = cmd_run_all(cfg, args.remote_command)
        else:
            parser.print_help()
            return 2
    except RuntimeError as e:
        print(f"error: {e}", file=sys.stderr)
        return 1

    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
