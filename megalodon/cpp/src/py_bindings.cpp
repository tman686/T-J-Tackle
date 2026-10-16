// pybind11 wrappers — the OPTION B path (compiled wrapper over the Python C API).
//
// This file is compiled only when pybind11 is available (see setup.py / CMake).
// It produces the native extension module `_megalodon`, giving Python an
// ergonomic, typed surface over the same C++ core the ctypes path uses.
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

#include <vector>

#include "megalodon/core.hpp"

namespace py = pybind11;

PYBIND11_MODULE(_megalodon, m) {
  m.doc() = "Megalodon native core (pybind11 bridge over the C++ engine)";
  m.attr("__version__") = megalodon::version();

  m.def("version", &megalodon::version, "Core library version string.");
  m.def(
      "fingerprint",
      [](const std::string& data) { return megalodon::fingerprint(data); },
      py::arg("data"), "Deterministic 64-bit FNV-1a fingerprint of a string.");
  m.def(
      "sum",
      [](const std::vector<double>& v) { return megalodon::sum(v.data(), v.size()); },
      py::arg("data"));
  m.def(
      "mean",
      [](const std::vector<double>& v) { return megalodon::mean(v.data(), v.size()); },
      py::arg("data"));
  m.def(
      "ema",
      [](const std::vector<double>& v, double alpha) {
        return megalodon::ema(v.data(), v.size(), alpha);
      },
      py::arg("data"), py::arg("alpha") = 0.5);

  py::class_<megalodon::Engine>(m, "Engine")
      .def(py::init<std::string>(), py::arg("name") = "megalodon")
      .def_property_readonly("name", &megalodon::Engine::name)
      .def(
          "observe",
          [](megalodon::Engine& e, const std::vector<double>& v) {
            e.observe(v.data(), v.size());
          },
          py::arg("data"))
      .def_property_readonly("count", &megalodon::Engine::count)
      .def_property_readonly("total", &megalodon::Engine::total)
      .def_property_readonly("minimum", &megalodon::Engine::minimum)
      .def_property_readonly("maximum", &megalodon::Engine::maximum)
      .def_property_readonly("average", &megalodon::Engine::average)
      .def("reset", &megalodon::Engine::reset);
}
