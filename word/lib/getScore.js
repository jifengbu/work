const _ = require('lodash');
const config = require(../config);
const {
    FILL_BLANK_SUBJECT,
    JUDGEMENT_SUBJECT,
    SINGLE_SELECT_SUBJECT,
    MULTI_SELECT_SUBJECT,
    ANSWER_QUESTION_SUBJECT,
} = config;

module.exports = function(answers, base) {
    answers = b;
    for (const item of answers) {
        const k = _.find(base, o=>o.type === item.type && o.num === item.num && o.index === item.index);
        if (item.type === FILL_BLANK_SUBJECT) {
                  // if (item.value === k.)
        }
    }
    return 100;
}
var b = [{"type":0,"num":1,"index":0,"value":"安全"},{"type":0,"num":1,"index":1,"value":""},{"type":0,"num":1,"index":2,"value":""},{"type":0,"num":13,"index":0,"value":""},{"type":0,"num":13,"index":1,"value":""},{"type":0,"num":14,"index":0,"value":""},{"type":0,"num":14,"index":1,"value":""},{"type":0,"num":15,"index":0,"value":""},{"type":0,"num":15,"index":1,"value":""},{"type":0,"num":18,"index":0,"value":""},{"type":0,"num":19,"index":0,"value":""},{"type":0,"num":24,"index":0,"value":""},{"type":0,"num":24,"index":1,"value":""},{"type":0,"num":27,"index":0,"value":""},{"type":0,"num":32,"index":0,"value":""},{"type":0,"num":33,"index":0,"value":""},{"type":0,"num":35,"index":0,"value":""},{"type":0,"num":36,"index":0,"value":""},{"type":0,"num":38,"index":0,"value":""},{"type":0,"num":44,"index":0,"value":""},{"type":0,"num":44,"index":1,"value":""},{"type":0,"num":45,"index":0,"value":""},{"type":0,"num":45,"index":1,"value":""},{"type":0,"num":59,"index":0,"value":""},{"type":0,"num":59,"index":1,"value":""},{"type":0,"num":65,"index":0,"value":""},{"type":0,"num":65,"index":1,"value":""},{"type":0,"num":81,"index":0,"value":""},{"type":0,"num":83,"index":0,"value":""},{"type":0,"num":83,"index":1,"value":""},{"type":0,"num":88,"index":0,"value":""},{"type":0,"num":88,"index":1,"value":""},{"type":0,"num":88,"index":2,"value":""},{"type":1,"num":3,"value":1},{"type":1,"num":7,"value":1},{"type":1,"num":13,"value":1},{"type":1,"num":18,"value":1},{"type":1,"num":24,"value":1},{"type":1,"num":25,"value":1},{"type":1,"num":27,"value":1},{"type":1,"num":29,"value":1},{"type":1,"num":35,"value":1},{"type":1,"num":36,"value":1},{"type":1,"num":40,"value":1},{"type":1,"num":42,"value":1},{"type":1,"num":44,"value":1},{"type":1,"num":57,"value":1},{"type":1,"num":59,"value":1},{"type":1,"num":60,"value":1},{"type":1,"num":61,"value":1},{"type":1,"num":63,"value":1},{"type":1,"num":66,"value":1},{"type":1,"num":84,"value":1},{"type":2,"num":1,"value":"A"},{"type":2,"num":12,"value":"A"},{"type":2,"num":15,"value":"A"},{"type":2,"num":22,"value":"A"},{"type":2,"num":29,"value":"A"},{"type":2,"num":32,"value":"A"},{"type":2,"num":35,"value":"A"},{"type":2,"num":38,"value":"A"},{"type":2,"num":43,"value":"A"},{"type":2,"num":45,"value":"A"},{"type":3,"num":5,"value":null},{"type":3,"num":7,"value":null},{"type":3,"num":8,"value":null},{"type":3,"num":10,"value":null},{"type":3,"num":12,"value":null},{"type":3,"num":13,"value":null},{"type":3,"num":17,"value":null},{"type":3,"num":25,"value":null},{"type":3,"num":26,"value":null},{"type":3,"num":33,"value":null},{"type":4,"num":3,"value":[]},{"type":4,"num":5,"value":[]}];
