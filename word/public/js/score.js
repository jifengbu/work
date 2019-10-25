const FILL_BLANK_SUBJECT = 0;
const JUDGEMENT_SUBJECT = 1;
const SINGLE_SELECT_SUBJECT = 2;
const MULTI_SELECT_SUBJECT = 3;
const ANSWER_QUESTION_SUBJECT = 4;

function parseForFillBlankSubject(answers) {
    $("[data-type=" + FILL_BLANK_SUBJECT + "]").each((k, o)=>{
        const num = $(o).data('num');
        const index = $(o).data('index');
        const value = $(o).val();
        answers.push({ type: FILL_BLANK_SUBJECT, num, index, value });
    });
}

function parseForJudgementSubject(answers) {
    $("[data-type=" + JUDGEMENT_SUBJECT + "]").each((k, o)=>{
        var num = $(o).data('num');
        var value = $(o).val()*1;
        answers.push({ type: JUDGEMENT_SUBJECT, num,  value });
    });
}
function parseForSingleSelectSubject(answers) {
    $("[data-type=" + SINGLE_SELECT_SUBJECT + "]").each((k, o)=>{
        var num = $(o).data('num');
        var value = $(o).val();
        answers.push({ type: SINGLE_SELECT_SUBJECT, num,  value });
    });
}
function parseForMultiSelectSubject(answers) {
    $("[data-type=" + MULTI_SELECT_SUBJECT + "]").each((k, o)=>{
        var num = $(o).data('num');
        var value = $(o).val().join('');
        answers.push({ type: MULTI_SELECT_SUBJECT, num,  value });
    });
}
function parseForAnswerQuestionSubject(answers) {
    $("[data-type=" + ANSWER_QUESTION_SUBJECT + "]").each((k, o)=>{
        var num = $(o).data('num');
        var value = $(o).val().split('\n').filter(o=>o);
        answers.push({ type: ANSWER_QUESTION_SUBJECT, num,  value });
    });
}
function submitScore() {
    const answers = [];
    parseForFillBlankSubject(answers);
    parseForJudgementSubject(answers);
    parseForSingleSelectSubject(answers);
    parseForMultiSelectSubject(answers);
    parseForAnswerQuestionSubject(answers);

    $.ajax({
        type: "POST",
        url: "/submitScore",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(answers),
        success: function (data) {
            if (!data.success) {
                return window.alert('服务器错误，请稍后再试');
            }
            var ret = window.confirm("得分:" + data.context.score + ",是否继续考试?选择是继续考试，选择否停留在这个界面查看题目！");
            if (ret) {
                location.reload();
            } else {
                window.alert("请认真查看错误的地方。");
            }
        }
    });
}
