#include <stdio.h>
#include <emscripten/emscripten.h>

int EMSCRIPTEN_KEEPALIVE add (int x) {
    if (x == 1 || x == 2) {
        return 1;
    }
    return fibrac(x - 1) + fibrac(x - 2);
}
