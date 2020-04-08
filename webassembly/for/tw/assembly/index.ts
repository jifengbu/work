// The entry file of your WebAssembly module.

function cal(x: f64): f64 {
    if (x < 100) {
        return x + 10;
    } else if (x < 1000) {
        return 3*x - 20;
    }
    return x * 2 - 30;
}
export function fang(): f64 {
    var a: f64;
    for (var i:f64=0; i<3000000000; i++) {
        a = cal(i);
    }
    return a;
}
