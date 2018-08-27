var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(bodyParser.text());


app.post('/test', function (req, res) {
    const buffer=[];
    let size = 0;
    req.on('data', function(chunk) {
        console.log("=====", chunk, chunk.length);
        buffer.push(chunk);
        size += chunk.length;
    });
    req.on('end', function() {
        res.send(Buffer.concat(buffer, size));
    });

});

app.listen(4000, function() {
    console.log("server listen on: http://localhost:4000");
});
