// The entry file of your WebAssembly module.

export function fibrac(x: i32): i32 {
    if (x === 1 || x === 2) {
        return 1;
    }
    return fibrac(x - 1) + fibrac(x - 2);
}
