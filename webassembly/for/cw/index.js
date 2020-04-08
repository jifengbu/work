const mod = require('./clibs');

var start = Date.now();
var a = mod.fibrac(50);
var end = Date.now();
console.log("=======", a);
console.log("=======", end-start);
