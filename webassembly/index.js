const clibs = require('./clibs');


clibs._main(); // main函数是默认导出的

clibs._hello();

// var add = clibs.cwrap('add', 'number', ['number', 'number']);
// var a = add(1, 2);
// console.log(a);
//
// var a = clibs.ccall('add', 'number', ['number', 'number'], [1, 2]);
// console.log(a);

var a = clibs._add(1, 2);
console.log(a);

clibs._call_js_code(4, 5);

clibs._call_js_code_and_return(5, 5);

clibs._call_js_function(5, 10);

clibs._my_sleep();
