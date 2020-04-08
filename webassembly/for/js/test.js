function cal(x) {
    if (x < 100) {
        return x + 10;
    } else if (x < 1000) {
        return 3*x - 20;
    }
    return x * 2 - 30;
}


var start = Date.now();
var a;
for (var i=0; i<3000000000; i++) {
    a = cal(i);
}
var end = Date.now();
console.log("=======%d\n", a);
console.log("=======", end-start);
