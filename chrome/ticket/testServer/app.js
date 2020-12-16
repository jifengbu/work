var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

var count = 0 ;
app.post("/test", (req, res)=>{
    res.send({ count: count++ });
});

app.listen(4000, function() {
    console.log("server listen on: http://localhost:4000");
});
