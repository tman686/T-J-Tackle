#!/usr/bin/env bash
# Build Megalodon on Linux/macOS.
#   ./scripts/build.sh            # ctypes shared library only (no extra deps)
#   ./scripts/build.sh --pybind   # also build the pybind11 native extension
set -euo pipefail
cd "$(dirname "$0")/.."

echo ">> Building ctypes shared library (OPTION A)"
make

if [[ "${1:-}" == "--pybind" ]]; then
  echo ">> Building pybind11 extension (OPTION B)"
  python3 -m pip install --quiet pybind11
  python3 setup.py build_ext --inplace
fi

echo ">> Done. Try:  PYTHONPATH=python python3 -m megalodon --status"
