var java = require('java');
// java.classpath.push('bin/classes');
java.classpath.push('Fang.jar');

var javaLangSystem = java.import('java.lang.System');
javaLangSystem.out.printlnSync('Hello World');

var Fang = java.import('com.fang.Fang');
Fang.Test();
var result = Fang.addNumbersSync(1, 2);
console.log(result);

var result = java.callStaticMethodSync('com.fang.Fang', 'addNumbers', 4, 5);
console.log(result);

// Fang.addNumbers(2, 2,(err, result)=>{
//     console.log(err, result, 'from async');
// });

Fang.c = 99;

// var fang = java.newInstanceSync('com.fang.Fang', 100);
var fang = new Fang(100);
console.log(fang.getIntSync());
console.log(fang.b);
console.log(Fang.c);

java.setStaticFieldValue("com.fang.Fang", "c", 88);
var c = java.getStaticFieldValue("com.fang.Fang", "c");
console.log(c);
