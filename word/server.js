const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const parseSubject = require('./lib/parseSubject');
const parseAnswer = require('./lib/parseAnswer');
const getScore = require('./lib/getScore');
const config = require('./config');
const app = express();
let answer;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.get("/test", (req, res)=>{
    parseSubject({ list: config.list, file: config.subjectFile }, (html)=>{
        res.send(html);
    });
});

app.post("/submitScore", (req, res)=>{
    console.log("=======", JSON.stringify(req.body));
    // res.send({ success: true, context: { score: getScore(req.body, answer) } });
});

parseAnswer({ list: config.list, file: config.answerFile}, (_answer)=>{
    // console.log("=======", JSON.stringify(_answer));
    answer = _answer;
    getScore('', answer);
    // app.listen(4000, function() {
    //     console.log("server listen on: http://localhost:4000/test");
    // });
});
