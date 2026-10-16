# Megalodon

A Python application over a compiled **C++ core**, wired to **CogniPrime** — an
Ollama-compatible local LLM server — over its local HTTP API. Megalodon implements the classic native-extension
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
      └── your local CogniPrime server (Ollama-compatible HTTP API @ 127.0.0.1:11434)
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
PYTHONPATH=python python3 -m megalodon --status                 # stack + CogniPrime status/models
PYTHONPATH=python python3 -m megalodon compute 12 8 5 9 14      # run the C++ core
PYTHONPATH=python python3 -m megalodon connect                  # verify CogniPrime + list models
PYTHONPATH=python python3 -m megalodon ask "Best soft-plastic color for stained water?"
```

`--status` reports which backend loaded (`ctypes` or `pybind11`), whether
CogniPrime is reachable, and which models it is serving.

## Test

```bash
make test          # builds the library, runs the suite on the ctypes backend
MEGALODON_BACKEND=pybind11 python3 -m pytest tests -q   # same suite, native module
```

## Connecting to CogniPrime

CogniPrime is an **Ollama-compatible local LLM server**, so the client
(`python/megalodon/cogniprime.py`) speaks that HTTP API:

| Call | Route |
| --- | --- |
| `list_models()` / health probe | `GET /api/tags` |
| `generate(prompt, model)` | `POST /api/generate` |
| `chat(messages, model)` | `POST /api/chat` |

- The endpoint defaults to Ollama's standard local address
  `http://127.0.0.1:11434`, so once CogniPrime is running on your machine
  Megalodon connects with no extra setup.
- Override anything via environment variables:
  ```bash
  export COGNIPRIME_ENDPOINT="http://127.0.0.1:11434"   # where CogniPrime listens
  export COGNIPRIME_MODEL="llama3.2"                     # optional; else first available
  export COGNIPRIME_TOKEN="your-token"                  # optional
  ```
  or copy `megalodon.example.json` → `megalodon.json` and fill it in
  (`megalodon.json` is git-ignored, so local settings stay out of the repo).
- **Offline safety:** blank the endpoint and the client goes offline — every
  call is a logged local no-op and nothing leaves the machine.
- If your CogniPrime remake diverges from the Ollama API, `cogniprime.py` is the
  single file to adapt; nothing else in Megalodon changes.

## Fleet — running commands on your own machines (SSH)

Megalodon can drive **your own** machines (Ubuntu, Kali, Windows-with-OpenSSH)
from one place, using the standard OpenSSH client. `python/megalodon/fleet.py`
just shells out to `ssh` — there is no custom agent, protocol, persistence, or
concealment; everything it runs is logged and is exactly what you could type by
hand.

**Setup** — key-based auth is required (the client passes `BatchMode=yes`, so it
never prompts for or stores a password):
```bash
ssh-keygen -t ed25519                      # once, if you don't have a key
ssh-copy-id tj@192.168.1.20                # authorize your key on each machine
```
For Windows targets, install the **OpenSSH Server** optional feature and set the
host's `"shell": "powershell"` so commands run in PowerShell.

**Configure** hosts in `megalodon.json` (copy from `megalodon.example.json`; it's
git-ignored, so your inventory stays local):
```json
"fleet": {
  "hosts": [
    { "name": "ubuntu",  "hostname": "192.168.1.20", "user": "tj",   "shell": "bash" },
    { "name": "kali",    "hostname": "192.168.1.21", "user": "kali", "shell": "bash" },
    { "name": "windows", "hostname": "192.168.1.22", "user": "tj",   "shell": "powershell" }
  ]
}
```

**Use**:
```bash
PYTHONPATH=python python3 -m megalodon hosts                 # list configured hosts
PYTHONPATH=python python3 -m megalodon check                 # test SSH to all of them
PYTHONPATH=python python3 -m megalodon run-on kali "uname -a"
PYTHONPATH=python python3 -m megalodon run-all "uptime"      # every enabled host
```

Security notes: host-key checking is left at OpenSSH defaults (your
`~/.ssh/known_hosts` governs — the client does not weaken it), commands are
passed to `subprocess` as an argument list (never through a local shell), and an
unreachable or unauthorized host returns a clean error result instead of hanging.

## Layout

| Path | Role |
| --- | --- |
| `cpp/include/megalodon/core.hpp`, `cpp/src/core.cpp` | Custom C++ logic |
| `cpp/src/c_api.cpp` | `extern "C"` ABI for the ctypes path (OPTION A) |
| `cpp/src/py_bindings.cpp` | pybind11 wrappers (OPTION B) |
| `python/megalodon/bridge.py` | Backend loader / bridge layer |
| `python/megalodon/core.py` | High-level Python API |
| `python/megalodon/cogniprime.py` | CogniPrime (Ollama) integration client |
| `python/megalodon/fleet.py` | SSH fleet control over the standard OpenSSH client |
| `python/megalodon/app.py` | Main application + CLI |
| `tests/` | Suite that runs against either backend |
