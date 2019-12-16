var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs-extra");
var path = require("path");
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

app.post("/saveTemplate", (req, res)=>{
    const template = req.body.template;
    const file = path.join(__dirname, 'template.md');
    fs.writeFileSync(file, template);
    res.send({ path:  file });
});

app.listen(4000, function() {
    console.log("server listen on: http://localhost:4000");
});
