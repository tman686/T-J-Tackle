# Build Megalodon on Windows (PowerShell). Requires MSVC Build Tools + Python.
#   .\scripts\build.ps1            # ctypes DLL only
#   .\scripts\build.ps1 -Pybind    # also build the pybind11 extension
param([switch]$Pybind)
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

New-Item -ItemType Directory -Force -Path build | Out-Null
Write-Host ">> Building ctypes DLL (OPTION A)"
# Compile the C ABI library to megalodon.dll with MSVC (cl) or clang.
cl /std:c++17 /O2 /LD /Icpp\include cpp\src\core.cpp cpp\src\c_api.cpp /Fe:build\megalodon.dll

if ($Pybind) {
  Write-Host ">> Building pybind11 extension (OPTION B)"
  python -m pip install --quiet pybind11
  python setup.py build_ext --inplace
}
Write-Host ">> Done. Try:  `$env:PYTHONPATH='python'; python -m megalodon --status"
