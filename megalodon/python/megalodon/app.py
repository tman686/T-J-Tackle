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
from .version import __version__


def _setup_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.INFO if verbose else logging.WARNING,
        format="%(levelname)s %(name)s: %(message)s",
    )


def cmd_status(cfg) -> dict:
    backend = bridge.load_backend(cfg.prefer_backend)
    client = CogniPrimeClient(cfg.cogniprime)
    return {
        "megalodon": __version__,
        "core_version": backend.version(),
        "backend": bridge.active_backend(),
        "cogniprime_endpoint": cfg.cogniprime.endpoint or "(not configured)",
        "cogniprime_online": client.health(),
    }


def cmd_compute(cfg, numbers: List[float]) -> dict:
    with core.Engine(cfg.cogniprime.node_name) as eng:
        eng.observe(numbers)
        summary = eng.summary()
    summary["ema_forecast"] = core.forecast_ema(numbers, alpha=0.5)
    summary["fingerprint"] = core.fingerprint(",".join(str(n) for n in numbers))

    # If CogniPrime is set up, forward the computed summary to it.
    client = CogniPrimeClient(cfg.cogniprime)
    client.connect()
    summary["forwarded_to_cogniprime"] = client.send_event("compute.summary", summary)
    return summary


def cmd_connect(cfg) -> dict:
    client = CogniPrimeClient(cfg.cogniprime)
    ok = client.connect()
    return {
        "configured": not client.offline,
        "connected": ok,
        "endpoint": cfg.cogniprime.endpoint or "(not configured)",
    }


def main(argv=None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    parser = argparse.ArgumentParser(prog="megalodon", description="Megalodon C++/Python core with CogniPrime integration.")
    parser.add_argument("-v", "--verbose", action="store_true", help="log requests and backend detail")
    parser.add_argument("--status", action="store_true", help="print stack + CogniPrime status and exit")
    sub = parser.add_subparsers(dest="command")

    p_compute = sub.add_parser("compute", help="run the C++ core over numbers")
    p_compute.add_argument("numbers", nargs="+", type=float)

    sub.add_parser("connect", help="register this node with CogniPrime")

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
