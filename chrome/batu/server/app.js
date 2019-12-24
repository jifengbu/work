const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const request = require('superagent');
const URL = require('url');

function download(url) {
    console.log('[url]:', url);
    return new Promise(resolve => {
        const filename = path.basename(_url.parse(url).pathname);
        request.get(encodeURI(url))
        .responseType('arraybuffer')
        .on('end', () => {
            resolve(filename);
        })
        .pipe(fs.createWriteStream(filename));
    });
}

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    next();
});

app.post('/saveTemplate', (req, res)=>{
    const template = req.body.template;
    const file = path.join(__dirname, 'template.md');
    fs.writeFileSync(file, template);
    res.send({ path:  file });
});

app.listen(4000, function() {
    console.log('server listen on: http://localhost:4000');
});
