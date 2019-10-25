const FILL_BLANK_SUBJECT = 0;
const JUDGEMENT_SUBJECT = 1;
const SINGLE_SELECT_SUBJECT = 2;
const MULTI_SELECT_SUBJECT = 3;
const ANSWER_QUESTION_SUBJECT = 4;

module.exports = {
    FILL_BLANK_SUBJECT,
    JUDGEMENT_SUBJECT,
    SINGLE_SELECT_SUBJECT,
    MULTI_SELECT_SUBJECT,
    ANSWER_QUESTION_SUBJECT,
    answerFile: __dirname + '/assets/answer.txt',
    subjectFile: __dirname + '/assets/subject.docx',
    list: [
        { type: FILL_BLANK_SUBJECT, count: 20, max: 89, answerTitle: '一、填空题' },
        { type: JUDGEMENT_SUBJECT, count: 20, max: 87, answerTitle: '二、判断题' },
        { type: SINGLE_SELECT_SUBJECT, count: 10, max: 51, answerTitle: '三、单项选择题' },
        { type: MULTI_SELECT_SUBJECT, count: 10, max: 34, answerTitle: '四、多选题' },
        { type: ANSWER_QUESTION_SUBJECT, count: 2, max: 7, answerTitle: '五、简答题' },
    ],
}
