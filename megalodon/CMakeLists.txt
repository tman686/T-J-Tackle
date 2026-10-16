# Megalodon — CMake build for the C++ core and (optionally) the pybind11 module.
#   cmake -S . -B build && cmake --build build
cmake_minimum_required(VERSION 3.18)
project(megalodon LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# OPTION A: the plain C-ABI shared library, loadable via ctypes anywhere.
add_library(megalodon SHARED cpp/src/core.cpp cpp/src/c_api.cpp)
target_include_directories(megalodon PUBLIC cpp/include)

# OPTION B: the pybind11 extension, built only when pybind11 is discoverable.
find_package(pybind11 CONFIG QUIET)
if(pybind11_FOUND)
  pybind11_add_module(_megalodon cpp/src/core.cpp cpp/src/py_bindings.cpp)
  target_include_directories(_megalodon PRIVATE cpp/include)
  message(STATUS "pybind11 found — building native extension _megalodon")
else()
  message(STATUS "pybind11 not found — building ctypes library only (OPTION A)")
endif()
