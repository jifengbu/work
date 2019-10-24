const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const parseSubject = require('./lib/parseSubject');
const app = express();

const list = [
    { type: 0, count: 20, max: 89 },
    { type: 1, count: 20, max: 87 },
    { type: 2, count: 10, max: 51 },
    { type: 3, count: 10, max: 34 },
    { type: 4, count: 2, max: 7 },
];

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.get("/test", (req, res)=>{
    parseSubject({ list, file: __dirname + '/assets/subject.docx' }, (html)=>{
        res.send(html);
    });
});

app.post("/submitScore", (req, res)=>{
});

app.listen(4000, function() {
    console.log("server listen on: http://localhost:4000");
});
