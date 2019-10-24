const parse = require('./parse');

let list = [
    { type: 0, count: 20, max: 89 },
    { type: 1, count: 20, max: 87 },
    { type: 2, count: 10, max: 51 },
    { type: 3, count: 10, max: 34 },
    { type: 4, count: 2, max: 7 },
];

parse({ list }, (html)=>{
    console.log(html);
});
