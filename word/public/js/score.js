const FILL_BLANK_SUBJECT = 0;
const JUDGEMENT_SUBJECT = 1;
const SINGLE_SELECT_SUBJECT = 2;
const MULTI_SELECT_SUBJECT = 3;
const ANSWER_QUESTION_SUBJECT = 4;

function parseForFillBlankSubject() {
    const answers = [];
    $("[data-type=" + FILL_BLANK_SUBJECT + "]").each((k, o)=>{
        const num = $(o).data('num');
        const index = $(o).data('index');
        const value = $(o).val();
        answers.push({ num, index, value });
    });
    return answers;
}

function parseForJudgementSubject() {
    const answers = [];
    $("[data-type=" + JUDGEMENT_SUBJECT + "]").each((k, o)=>{
        var num = $(o).data('num');
        var value = $(o).val();
        answers.push({ num,  value });
    });
    return answers;
}
function parseForSingleSelectSubject() {
    const answers = [];
    $("[data-type=" + SINGLE_SELECT_SUBJECT + "]").each((k, o)=>{
        var num = $(o).data('num');
        var value = $(o).val();
        answers.push({ num,  value });
    });
    return answers;
}
function parseForMultiSelectSubject() {
    const answers = [];
    $("[data-type=" + MULTI_SELECT_SUBJECT + "]").each((k, o)=>{
        var num = $(o).data('num');
        var value = $(o).val();
        answers.push({ num,  value });
    });
    return answers;
}
function parseForAnswerQuestionSubject() {
    const answers = [];
    $("[data-type=" + ANSWER_QUESTION_SUBJECT + "]").each((k, o)=>{
        var num = $(o).data('num');
        var value = $(o).val();
        answers.push({ num,  value });
    });
    return answers;
}
function submitScore() {
    const answers = {};
    answers[FILL_BLANK_SUBJECT] = parseForFillBlankSubject();
    answers[JUDGEMENT_SUBJECT] = parseForJudgementSubject();
    answers[SINGLE_SELECT_SUBJECT] = parseForSingleSelectSubject();
    answers[MULTI_SELECT_SUBJECT] = parseForMultiSelectSubject();
    answers[ANSWER_QUESTION_SUBJECT] = parseForAnswerQuestionSubject();
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
