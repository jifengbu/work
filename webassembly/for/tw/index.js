const fs = require("fs");
const loader = require("@assemblyscript/loader");
const mod = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), { /* imports */ })

var start = Date.now();
var a = mod.fang();
var end = Date.now();
console.log("=======", a);
console.log("=======", end-start);
