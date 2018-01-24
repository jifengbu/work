var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send({msg: 'Nginx 负载均衡2', server: 2});
})
var server = app.listen(5002, function(){
    console.log('Listen 5002')
})
