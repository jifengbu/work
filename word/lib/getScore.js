const _ = require('lodash');
const config = require('../config');
const {
    FILL_BLANK_SUBJECT,
    JUDGEMENT_SUBJECT,
    SINGLE_SELECT_SUBJECT,
    MULTI_SELECT_SUBJECT,
    ANSWER_QUESTION_SUBJECT,
} = config;

function getSimilarRate(str1, str2) {

    str1 = (str1||'').replace(/[,.'"()（）<>，。]*/g, '')
    str2 = (str2||'').replace(/[,.'"()（）<>，。]*/g, '')
    str1 = str1.split('');
    str2 = str2.split('');
    let count = 0, total = str2.length;
    for (let i in str1) {
        const index = str2.indexOf(str1[i]);
        if (index != -1) {
            count++;
            str2.splice(index, 1);
        }
    }
    return count / total;
}

function getFillBlankSocre(value1, value2, unitScore, rightRate) {
    const ret = getSimilarRate(value1, value2);
    if (ret >= rightRate) {
        return unitScore;
    }
    return 0;
}

function getAnswerQuestionSocre(value1, value2, unitScore, rightRate) {
    value1 = [...value1];
    value2 = [...value2];
    const inemScore = unitScore / value2.length;
    let score = 0;
    for (const item of value1) {
        const index = _.findIndex(value2, o=>getSimilarRate(item, o)>=rightRate);
        if (index != -1) {
            score += inemScore;
            value2.splice(index, 1);
        }
    }
    return score;
}

module.exports = function(answers, base) {
    answers = b;
    let score = 0;
    const blankCount = _.filter(answers, o=>o.type === FILL_BLANK_SUBJECT).length;
    const fillBlankRightRight = (_.find(config.list, o=>o.type ===FILL_BLANK_SUBJECT)||{}).rightRate;
    const answerQuestionRightRight = (_.find(config.list, o=>o.type ===ANSWER_QUESTION_SUBJECT)||{}).rightRate;
    const unitScoreList = _.mapValues(_.mapKeys(config.list, o=>o.type), o=>o.score/(o.type===FILL_BLANK_SUBJECT ? blankCount : o.count));
    for (const item of answers) {
        const k = _.find(base, o=>o.type === item.type && o.num === item.num && o.index === item.index);
        if (item.type === ANSWER_QUESTION_SUBJECT) {
            score += getAnswerQuestionSocre(item.value, k.value, unitScoreList[item.type], answerQuestionRightRight);
        } else if (item.type === FILL_BLANK_SUBJECT) {
            score += getFillBlankSocre(item.value, k.value, unitScoreList[item.type], fillBlankRightRight);
        } else {
            if (item.value === k.value) {
                score += unitScoreList[item.type];
            }
        }
    }
    return score;
}
