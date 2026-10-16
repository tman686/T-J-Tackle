#include "megalodon/core.hpp"

#include <algorithm>
#include <limits>
#include <sstream>

namespace megalodon {

std::string version() {
  std::ostringstream os;
  os << kVersionMajor << '.' << kVersionMinor << '.' << kVersionPatch;
  return os.str();
}

std::uint64_t fingerprint(const std::string& data) {
  // FNV-1a, 64-bit.
  std::uint64_t hash = 1469598103934665603ULL;
  for (unsigned char c : data) {
    hash ^= static_cast<std::uint64_t>(c);
    hash *= 1099511628211ULL;
  }
  return hash;
}

double sum(const double* data, std::size_t n) {
  double acc = 0.0;
  for (std::size_t i = 0; i < n; ++i) acc += data[i];
  return acc;
}

double mean(const double* data, std::size_t n) {
  if (n == 0) return 0.0;
  return sum(data, n) / static_cast<double>(n);
}

double ema(const double* data, std::size_t n, double alpha) {
  if (n == 0) return 0.0;
  if (alpha <= 0.0) alpha = 1e-9;
  if (alpha > 1.0) alpha = 1.0;
  double e = data[0];
  for (std::size_t i = 1; i < n; ++i) e = alpha * data[i] + (1.0 - alpha) * e;
  return e;
}

Engine::Engine(std::string name) : name_(std::move(name)) {}

void Engine::observe(const double* data, std::size_t n) {
  for (std::size_t i = 0; i < n; ++i) {
    const double v = data[i];
    if (count_ == 0) {
      min_ = max_ = v;
    } else {
      min_ = std::min(min_, v);
      max_ = std::max(max_, v);
    }
    total_ += v;
    ++count_;
  }
}

void Engine::reset() {
  count_ = 0;
  total_ = 0.0;
  min_ = 0.0;
  max_ = 0.0;
}

}  // namespace megalodon
