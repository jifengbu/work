#include <stdio.h>
#include <math.h>
#include <emscripten/emscripten.h>

// 一旦WASM模块被加载，main()中的代码就会执行
int main(int argc, char ** argv) {
    emscripten_run_script("console.log('hello js')");

    EM_ASM(
        console.log('hello js inline');
    );

    printf("WebAssembly module loaded\n");
}


void EMSCRIPTEN_KEEPALIVE call_js_code (int x, int y) {
    EM_ASM_({
        var ret = $0 + $1;
        Module.print('call_js_code:' + ret);
    }, x, y);
}

void EMSCRIPTEN_KEEPALIVE call_js_code_and_return (int x, int y) {
    int a = EM_ASM_INT({
        var ret = $0 + $1;
        Module.print('call_js_code_and_return:' + ret);
        return ret;
    }, x, y);
    printf("call_js_code_and_return in c: %d\n", a);
}

extern int js_add(int, int);
void EMSCRIPTEN_KEEPALIVE call_js_function (int x, int y) {
    int a = js_add(x, y);
    printf("call_js_function: %d\n", a);
}


void EMSCRIPTEN_KEEPALIVE hello (int x, int y) {
    printf("Hello WebAssembly\n");
}

int EMSCRIPTEN_KEEPALIVE add (int x, int y) {
    return x + y;
}
