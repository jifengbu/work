function fibrac(x) {
    if (x === 1 || x === 2) {
        return 1;
    }
    return fibrac(x - 1) + fibrac(x - 2);
}

var start = Date.now();
var a = fibrac(50);
var end = Date.now();
console.log("=======", a);
console.log("=======", end-start);
