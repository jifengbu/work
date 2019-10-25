const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');
const {
    FILL_BLANK_SUBJECT,
    JUDGEMENT_SUBJECT,
    SINGLE_SELECT_SUBJECT,
    MULTI_SELECT_SUBJECT,
    ANSWER_QUESTION_SUBJECT,
} = require(../config);

module.exports = function parseAnswer(options, callback) {
    const fsstream = fs.createReadStream(options.file);
    const rl = readline.createInterface({ input: fsstream });
    let currentType, answerQuestionNum;
    const answers = [];
    rl.on('line',function (line) {
        line = line.trim();
        if (!line) {
            return;
        }
        const listItem = _.find(options.list, o=>o.answerTitle===line);
        if (listItem) {
            currentType = listItem.type;
        } else {
            if (currentType == FILL_BLANK_SUBJECT) {
                const match = line.match(/^(\d+)\.(.*)/);
                if (match) {
                    const num = +match[1];
                    const list = match[2].split(';').map(o=>o.trim());
                    list.forEach((value, index)=>{
                        answers.push({ type: FILL_BLANK_SUBJECT, num, index, value });
                    });
                }
            } else if (currentType == JUDGEMENT_SUBJECT) {
                line = line.replace(/(\d+\.)\s*/g, '$1');
                const match = line.match(/\d+\../g);
                if (match) {
                    match.forEach(o=>{
                        const list = o.split('.');
                        answers.push({ type: JUDGEMENT_SUBJECT, num: +list[0], value: (list[1]==='√')*1 });
                    });
                }
            } else if (currentType == SINGLE_SELECT_SUBJECT) {
                line = line.replace(/(\d+\.)\s*/g, '$1');
                const match = line.match(/\d+\../g);
                if (match) {
                    match.forEach(o=>{
                        const list = o.split('.');
                        answers.push({ type: SINGLE_SELECT_SUBJECT, num: +list[0], value: list[1] });
                    });
                }
            } else if (currentType == MULTI_SELECT_SUBJECT) {
                line = line.replace(/(\d+\.)\s*/g, '$1');
                const match = line.match(/\d+\.[A-Z]+/g);
                if (match) {
                    match.forEach(o=>{
                        const list = o.split('.');
                        answers.push({ type: MULTI_SELECT_SUBJECT, num: +list[0], value: list[1].split('') });
                    });
                }
            } else if (currentType == ANSWER_QUESTION_SUBJECT) {
                let match = line.match(/^(\d+)\./);
                if (match) {
                    answerQuestionNum = match[1]*1;
                    answers.push({ type: ANSWER_QUESTION_SUBJECT, num: answerQuestionNum, value: [] });
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
