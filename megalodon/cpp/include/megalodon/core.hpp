// Megalodon — C++ core (the "Custom C++ Logic" node of the dependency tree).
//
// Pure, dependency-light compute engine. Uses only the C++ Standard Library
// (libstdc++ / MSVCP) and the C Runtime; no third-party libs. The Python layer
// reaches this through either a C ABI (ctypes) or pybind11 wrappers.
#pragma once

#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>

namespace megalodon {

// Library version — mirrored in python/megalodon/version.py.
constexpr int kVersionMajor = 0;
constexpr int kVersionMinor = 1;
constexpr int kVersionPatch = 0;

std::string version();

// Stable 64-bit content fingerprint (FNV-1a). Deterministic across platforms —
// useful as a cheap integrity/identity check for payloads crossing the bridge.
std::uint64_t fingerprint(const std::string& data);

// Sum of a contiguous double buffer.
double sum(const double* data, std::size_t n);

// Population mean; returns 0.0 for an empty buffer.
double mean(const double* data, std::size_t n);

// Exponential moving average of a series (smoothing 0<alpha<=1). A small, real
// forecasting primitive: seed the next-period estimate from recent history
// (e.g. per-SKU demand). Returns 0.0 for an empty series.
double ema(const double* data, std::size_t n, double alpha);

// The core engine. Holds no OS handles and owns no external resources, so it is
// safe to construct on either side of the language bridge.
class Engine {
 public:
  explicit Engine(std::string name = "megalodon");
  const std::string& name() const { return name_; }

  // Fold a batch of samples into the running summary (count/sum/min/max).
  void observe(const double* data, std::size_t n);
  std::uint64_t count() const { return count_; }
  double total() const { return total_; }
  double minimum() const { return count_ ? min_ : 0.0; }
  double maximum() const { return count_ ? max_ : 0.0; }
  double average() const { return count_ ? total_ / static_cast<double>(count_) : 0.0; }
  void reset();

 private:
  std::string name_;
  std::uint64_t count_ = 0;
  double total_ = 0.0;
  double min_ = 0.0;
  double max_ = 0.0;
};

}  // namespace megalodon
