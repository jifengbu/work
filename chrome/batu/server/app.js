var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    next();
});

app.post("/saveMarkdown", (req, res)=>{
    console.log(req.body);
    res.send({ path: 'fangyunjiang/fang' });
});

app.listen(4000, function() {
    console.log("server listen on: http://localhost:4000");
});
