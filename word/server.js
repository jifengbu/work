const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const parseSubject = require('./lib/parseSubject');
const parseAnswer = require('./lib/parseAnswer');
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


parseAnswer({ file: __dirname + '/assets/answer.txt', subjects: {
    0: '一、填空题',
    1: '二、判断题',
    2: '三、单项选择题',
    3: '四、多选题',
    4: '五、简答题',
}}, (x)=>{
    console.log("=======", JSON.stringify(x));
});


app.get("/test", (req, res)=>{
    parseSubject({ list, file: __dirname + '/assets/subject.docx' }, (html)=>{
        res.send(html);
    });
});

app.post("/submitScore", (req, res)=>{
    console.log("=======", req.body);
    res.send({ success: true, context: { score: 99 } });
});

// app.listen(4000, function() {
//     console.log("server listen on: http://localhost:4000");
// });
