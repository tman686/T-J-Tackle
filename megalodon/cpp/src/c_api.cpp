// Stable C ABI over the C++ core — the OPTION A path (ctypes / cffi).
//
// extern "C" keeps names unmangled and the signatures POD-only, so any language
// with a C FFI can load the shared library with no Python.h and no C++ ABI
// coupling. This is what python/megalodon/bridge.py binds when the pybind11
// extension is not present.
#include "megalodon/core.hpp"

#include <cstring>
#include <new>
#include <string>

using megalodon::Engine;

extern "C" {

// Returns a static, NUL-terminated version string. Do not free.
const char* mega_version() {
  static const std::string v = megalodon::version();
  return v.c_str();
}

unsigned long long mega_fingerprint(const char* data, unsigned long long len) {
  if (data == nullptr) return 0;
  return megalodon::fingerprint(std::string(data, static_cast<std::size_t>(len)));
}

double mega_sum(const double* data, unsigned long long n) {
  return megalodon::sum(data, static_cast<std::size_t>(n));
}

double mega_mean(const double* data, unsigned long long n) {
  return megalodon::mean(data, static_cast<std::size_t>(n));
}

double mega_ema(const double* data, unsigned long long n, double alpha) {
  return megalodon::ema(data, static_cast<std::size_t>(n), alpha);
}

// --- Opaque Engine handle ---
void* mega_engine_new(const char* name) {
  try {
    return new Engine(name ? std::string(name) : std::string("megalodon"));
  } catch (const std::bad_alloc&) {
    return nullptr;
  }
}

void mega_engine_free(void* h) { delete static_cast<Engine*>(h); }

void mega_engine_observe(void* h, const double* data, unsigned long long n) {
  if (h) static_cast<Engine*>(h)->observe(data, static_cast<std::size_t>(n));
}

unsigned long long mega_engine_count(void* h) {
  return h ? static_cast<Engine*>(h)->count() : 0;
}
double mega_engine_total(void* h) { return h ? static_cast<Engine*>(h)->total() : 0.0; }
double mega_engine_min(void* h) { return h ? static_cast<Engine*>(h)->minimum() : 0.0; }
double mega_engine_max(void* h) { return h ? static_cast<Engine*>(h)->maximum() : 0.0; }
double mega_engine_average(void* h) { return h ? static_cast<Engine*>(h)->average() : 0.0; }
void mega_engine_reset(void* h) {
  if (h) static_cast<Engine*>(h)->reset();
}

}  // extern "C"
