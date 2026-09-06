"""Build the optional pybind11 extension (OPTION B).

The package works without this step via the ctypes path (OPTION A, built with
`make`). Building the extension just adds the faster, typed native module.
"""
from setuptools import setup

try:
    from pybind11.setup_helpers import Pybind11Extension, build_ext

    ext_modules = [
        Pybind11Extension(
            "megalodon._megalodon",
            ["cpp/src/core.cpp", "cpp/src/py_bindings.cpp"],
            include_dirs=["cpp/include"],
            cxx_std=17,
        )
    ]
    cmdclass = {"build_ext": build_ext}
except ImportError:  # pybind11 absent — ship the pure-Python + ctypes package.
    ext_modules = []
    cmdclass = {}

setup(
    name="megalodon",
    version="0.1.0",
    packages=["megalodon"],
    package_dir={"": "python"},
    ext_modules=ext_modules,
    cmdclass=cmdclass,
)
