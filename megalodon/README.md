# Megalodon

A Python application over a compiled **C++ core**, with a pluggable
**CogniPrime** integration. Megalodon implements the classic native-extension
dependency stack — Python drives high-level logic, the heavy/low-level work runs
in a compiled C++ shared library, and the two meet at a bridge layer that
supports **both** binding styles.

## Dependency tree (as built)

```
[ Main Python Application ]            python/megalodon/app.py  (CLI: __main__.py)
 └── Python Runtime (3.9+)
      ├── Standard Libraries           argparse, json, ctypes, urllib, logging
      └── Binding / Bridge Layer       python/megalodon/bridge.py
           │
           ├── OPTION A: ctypes  ───────────────┐   (no third-party build deps)
           ├── OPTION B: pybind11 ──┐           │
           │        Python C API ───┘           │
           │                                     │
           └── [ Compiled C++ Dynamic Library ]  ▼   cpp/  →  libmegalodon.{so,dylib}/megalodon.dll
                ├── Custom C++ Logic            cpp/src/core.cpp  (Engine, ema, fingerprint, …)
                └── Low-Level Dependencies
                     ├── C++ Standard Library   libstdc++ / MSVCP
                     ├── C Runtime Library      glibc / Universal CRT
                     └── Operating System API   Linux syscalls / Windows API

[ Main Python Application ]
 └── CogniPrime client                 python/megalodon/cogniprime.py
      └── your local CogniPrime instance (configured, opt-in — offline until set up)
```

The bridge prefers the pybind11 native module when it is compiled, and
transparently falls back to loading the plain C-ABI library via `ctypes`.
Application code imports `megalodon.core` and never has to care which is live.

## Build

**Linux / macOS**
```bash
cd megalodon
./scripts/build.sh              # ctypes library only (just needs a C++17 compiler)
./scripts/build.sh --pybind     # also build the faster pybind11 extension
```
or simply `make` (ctypes) — or `cmake -S . -B build && cmake --build build`.

**Windows** (MSVC Build Tools + Python)
```powershell
cd megalodon
.\scripts\build.ps1             # megalodon.dll (ctypes)
.\scripts\build.ps1 -Pybind     # + pybind11 extension
```

## Run

```bash
PYTHONPATH=python python3 -m megalodon --status
PYTHONPATH=python python3 -m megalodon compute 12 8 5 9 14
PYTHONPATH=python python3 -m megalodon connect        # register with CogniPrime
```

`--status` reports which backend loaded (`ctypes` or `pybind11`) and whether
CogniPrime is reachable.

## Test

```bash
make test          # builds the library, runs the suite on the ctypes backend
MEGALODON_BACKEND=pybind11 python3 -m pytest tests -q   # same suite, native module
```

## Connecting to CogniPrime

The CogniPrime client (`python/megalodon/cogniprime.py`) is **opt-in and
transparent**:

- It talks **only** to the endpoint you configure. Until then it is in
  **offline** mode: every call is a logged local no-op and nothing leaves the
  machine.
- Configure it when you set CogniPrime up, via environment variables:
  ```bash
  export COGNIPRIME_ENDPOINT="http://127.0.0.1:8080"
  export COGNIPRIME_TOKEN="your-token"      # optional
  ```
  or copy `megalodon.example.json` → `megalodon.json` and fill it in
  (`megalodon.json` is git-ignored so your local settings stay out of the repo).
- It assumes a minimal JSON/HTTP protocol: `GET /health`, `POST /v1/register`,
  `POST /v1/events`. If your CogniPrime speaks something else (a Unix socket,
  gRPC, a queue), that one file is the only thing to adapt.

## Layout

| Path | Role |
| --- | --- |
| `cpp/include/megalodon/core.hpp`, `cpp/src/core.cpp` | Custom C++ logic |
| `cpp/src/c_api.cpp` | `extern "C"` ABI for the ctypes path (OPTION A) |
| `cpp/src/py_bindings.cpp` | pybind11 wrappers (OPTION B) |
| `python/megalodon/bridge.py` | Backend loader / bridge layer |
| `python/megalodon/core.py` | High-level Python API |
| `python/megalodon/cogniprime.py` | CogniPrime integration client |
| `python/megalodon/app.py` | Main application + CLI |
| `tests/` | Suite that runs against either backend |
