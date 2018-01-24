var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send({msg: 'Nginx 负载均衡1', server: 1});
})
var server = app.listen(5001, function(){
    console.log('Listen 5001')
})
