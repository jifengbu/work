const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');

module.exports = function parseAnswer(options, callback) {
    const fsstream = fs.createReadStream(options.file);
    const rl = readline.createInterface({ input: fsstream });
    const subjects = options.subjects;
    let currentKey, answerQuestionNum;
    const answers = [];
    rl.on('line',function (line) {
        line = line.trim();
        if (!line) {
            return;
        }
        const key = _.findKey(subjects, o=>o===line);
        if (key != undefined) {
            currentKey = key;
        } else {
            if (currentKey == 0) {
                const match = line.match(/^(\d+)\.(.*)/);
                if (match) {
                    const num = +match[1];
                    const list = match[2].split(';').map(o=>o.trim());
                    list.forEach((value, index)=>{
                        answers.push({ type: 2, num, index, value });
                    });
                }
            } else if (currentKey == 1) {
                line = line.replace(/(\d+\.)\s*/g, '$1');
                const match = line.match(/\d+\../g);
                if (match) {
                    match.forEach(o=>{
                        const list = o.split('.');
                        answers.push({ type: 2, num: +list[0], value: (list[1]==='√')*1 });
                    });
                }
            } else if (currentKey == 2) {
                line = line.replace(/(\d+\.)\s*/g, '$1');
                const match = line.match(/\d+\../g);
                if (match) {
                    match.forEach(o=>{
                        const list = o.split('.');
                        answers.push({ type: 2, num: +list[0], value: list[1] });
                    });
                }
            } else if (currentKey == 3) {
                line = line.replace(/(\d+\.)\s*/g, '$1');
                const match = line.match(/\d+\.[A-Z]+/g);
                if (match) {
                    match.forEach(o=>{
                        const list = o.split('.');
                        answers.push({ type: 2, num: +list[0], value: list[1].split('') });
                    });
                }
            } else if (currentKey == 4) {
                let match = line.match(/^(\d+)\./);
                if (match) {
                    answerQuestionNum = match[1]*1;
                    answers.push({ type: 4, num: answerQuestionNum, value: [] });
                } else {
                    match = line.match(/^(\d+)\)(.*)/);
                    if (match) {
                        const item = _.find(answers, o=>o.type===4&&o.num===answerQuestionNum);
                        item.value.push(match[2]);
                    }
                }
            }
        }
    });
    rl.on('close',function () {
        callback(answers);
    });
}
