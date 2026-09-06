# Megalodon — builds the zero-dependency shared library (OPTION A / ctypes path).
# No pybind11, no Python.h required. Just a C++17 compiler.
#
#   make            # build the shared library into build/
#   make test       # build, then run the Python test suite
#   make clean

CXX      ?= g++
CXXFLAGS ?= -std=c++17 -O2 -fPIC -Wall -Wextra
INCLUDES  = -Icpp/include
SRC       = cpp/src/core.cpp cpp/src/c_api.cpp
BUILD     = build

UNAME_S  := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
  LIBNAME = libmegalodon.dylib
  SOFLAGS = -dynamiclib
else
  LIBNAME = libmegalodon.so
  SOFLAGS = -shared
endif

LIB = $(BUILD)/$(LIBNAME)

.PHONY: all clean test
all: $(LIB)

$(LIB): $(SRC) cpp/include/megalodon/core.hpp
	@mkdir -p $(BUILD)
	$(CXX) $(CXXFLAGS) $(SOFLAGS) $(INCLUDES) $(SRC) -o $(LIB)
	@echo "built $(LIB)"

test: all
	MEGALODON_LIB=$(abspath $(LIB)) python3 -m pytest tests -q

clean:
	rm -rf $(BUILD)
