// 源码地址： https://github.com/Ali1213/docx2markdown
const fs = require('fs');
const AdmZip = require('adm-zip');
const XmlReader = require('xml-reader');
const _ = require('lodash');
let hasLog = false;

const FILL_BLANK_SUBJECT = 0;
const JUDGEMENT_SUBJECT = 1;
const SINGLE_SELECT_SUBJECT = 2;
const MULTI_SELECT_SUBJECT = 3;
const ANSWER_QUESTION_SUBJECT = 4;

let current_index = -1;
let valid_list = [];

function getList(len, max) {
    var a = [];
    while (a.length < len) {
        var t = _.random(1, max);
        if (!_.includes(a, t)) {
            a.push(t);
        }
    }
    _.sortBy(a);
    return a;
}
function parseStyle(xmlStr){
    return xmlStr.match(/<w:style w:type\=\"paragraph\"[\s\S]+?<\/w:style>/ig).map((item)=> {
        const iRe = /w:styleid\=\"([\s\S]+?)\"[\s\S]+?w:name[\s\S]+?w:val\=\"([\s\S]+?)\"[\s\S]+?/ig;
        const match = iRe.exec(item);
        return {
            id: match[1],
            val: match[2]
        }
    });
}

function parseNumber(xmlStr) {
    const rtnObj = {};
    //<abstractNumId>标签内的各种属性
    const properties = xmlStr.match(/<w:abstractNum[\s\S]+?<\/w:abstractNum>/ig).map((item)=> {
        let idRe = /w:abstractNumId\=\"([\s\S]+?)\"/ig;
        let match = idRe.exec(item);

        let arr = item.match(/<w:lvl[\s\S]+?<\/w:lvl>/ig).map((otem)=> {
            let lvlRe = /w:lvl[\s\S]+?w:ilvl\=\"([\s\S]+?)\"[\s\S]+?<w:start[\s\S]+?w:val=\"([\s\S]+?)\"[\s\S]+?<w:numFmt[\s\S]+?w:val\=\"([\s\S]+?)\"\/>[\s\S]+?w:lvlText\s+?w:val=\"([\s\S]+?)\"[\s\S]+?<\/w:lvl>/ig;
            let match2 = lvlRe.exec(otem);
            return {
                ilvl: match2[1],
                numFmt: match2[3],
                lvlText: match2[4],
                start: match2[2]
            }
        });

        return {
            abstractNumId: match[1],
            children: arr
        }
    });
    //<numId>标签解析 ，numId与abstractNumId之间的关系
    const relation = xmlStr.match(/<w:num\s+?w:numId\=\"([\s\S]+?)\"[\s\S]+?w:abstractNumId w:val="([\s\S]+?)"[\s\S]+?<\/w:num>/ig).map((item)=> {
        let relationRe = /<w:num\s+?w:numId\=\"([\s\S]+?)\"[\s\S]+?w:abstractNumId w:val="([\s\S]+?)"[\s\S]+?<\/w:num>/ig;
        let match = relationRe.exec(item);
        return {
            numId: match[1],
            abstractNumId: match[2]
        }
    });
    relation.forEach((item)=> {
        properties.some((otem)=> {
            if (otem.abstractNumId === item.abstractNumId) {
                rtnObj[item.numId] = otem;
                return true;
            }
        })
    })
    return rtnObj;
}
function getSubject() {
    return valid_list[current_index] || { list:[] };
}
function log(...args) {
    hasLog && console.log(...args);
}

const Translate = function (filePath) {
    this.zip = new AdmZip(filePath);
    this.docx = this.zip.readAsText('word/document.xml');

    //存储，记录比标题序列号
    this.numberContext = {};
    this.pStyleArr = parseStyle(this.zip.readAsText('word/styles.xml'));
    this.numberObj = parseNumber(this.zip.readAsText('word/numbering.xml'));

    this.content = '';
};

Translate.prototype.traverseNodes = function (nodes, fun) {
    return nodes.map(o=>this[fun](o)).join('');
};
Translate.prototype.parseBody = function (nodes) {
    nodes.forEach((item)=> {
        if (item.type === 'element' && item.name === 'w:p') {
            const paragraph = this.traverseNodes(item.children, 'paragraph');
            if (paragraph) {
                this.content += paragraph + '<br/>\n';
            }
        } else {
            log('[parseBody]: type : ' + item.type + ' and name:' + item.name + ' not supported');
        }
    });
    this.content += this.getLastElement();
};
Translate.prototype.getLastElement = function (node) {
    let element = '';
    if (this.lastSubject) {
        const type = getSubject().type;
        if (type === JUDGEMENT_SUBJECT) {
            element = `<select data-type=${type} data-num=${this.subjectNO}><option value=0>正确</option><option value=0>错误</option></select>`;
        } else if (type === SINGLE_SELECT_SUBJECT) {
            const list = this.lastSubject.match(/[ABCD]\./g).map(o=>o[0]);
            element = `<select data-type=${type} data-num=${this.subjectNO}>${list.map(o=>`<option value=${o}>${o}</option>`).join('')}</select>`;
        } else if (type === MULTI_SELECT_SUBJECT) {
            const list = this.lastSubject.match(/[ABCD]\./g).map(o=>o[0]);
            element = `<select multiple data-type=${type} data-num=${this.subjectNO}>${list.map(o=>`<option value=${o}>${o}</option>`).join('')}</select>`;
        } else if (type === ANSWER_QUESTION_SUBJECT) {
            element = `<textarea data-type=${type} data-num=${this.subjectNO} rows="10" cols="80"></textarea>`;
        }
    }
    return element ? element + '<br/><br/>\n\n' : '';
}
Translate.prototype.paragraph = function (node) {
    let pObj = {};
    let pText = '';

    if (node.type === 'element' && node.name === 'w:pPr') {
        //pPr为段落样式；
        if (node.children) {
            const no = this.traverseNodes(node.children, 'paragraphStyle');
            if (no === '__title__') {
                pText += this.getLastElement() + '';
                this.skip = false;
                this.isSubject = false; // 是否是题目
                this.lastSubject = ''; // 上一道题目
                this.subjectIndex = 1; // 实际题号
                current_index++;
            } else if (/^\d+\.$/.test(no)) {
                const num = +(no.match(/\d+/)[0]);
                if (getSubject().list.indexOf(num) === -1) {
                    this.skip = true;
                } else {
                    pText += this.getLastElement() + this.subjectIndex + '. ';
                    this.skip = false;
                    this.subjectNO = num; // 题目的题号
                    this.inputIndex = 0; // 填空题的填空序号
                    this.inputSize = 0; // 填空题的填空size
                    // 记录当前题的做题控件
                    this.isSubject = true; // 是否是题目
                    this.lastSubject = ''; // 上一道题目
                    this.subjectIndex++;
                }
            } else if (!this.skip){
                pText +=  no + ' ';
                if (this.isSubject) {
                    this.lastSubject += no;
                }
            }
        }
    } else if (node.type === 'element' && node.name === 'w:t') {
        if (node.children) {
            if (node.attributes['xml:space'] === 'preserve' && current_index === 0) {
                if (!this.skip) {
                    if (getSubject().type === FILL_BLANK_SUBJECT) {
                        this.inputSize++;
                    } else {
                        pText += '    ';
                    }
                }
            } else {
                pText += this.traverseNodes(node.children, 'paragraph');
            }
        }
    } else if (node.type === 'element' && node.name === 'w:r') {
        if (node.children) {
            pText += this.traverseNodes(node.children, 'paragraph');
        }
    } else if (node.type === 'text' && node.name === '') {
        //文本文档
        if (!this.skip) {
            pText += (this.inputSize > 0 ? `<input data-type=${FILL_BLANK_SUBJECT} data-num=${this.subjectNO} data-index=${this.inputIndex} data-size=${this.inputSize} />` : '') + node.value;
            this.inputSize = 0;
            this.inputIndex++;
            if (this.isSubject) {
                this.lastSubject += node.value;
            }
        }
    } else {
        log('[paragraph]: type : ' + node.type + ' and name:' + node.name + ' not supported');
    }
    return pText;
};
Translate.prototype.paragraphStyle = function (node) {
    let pStyleText = '';
    if (node.type === 'element' && node.name === 'w:pStyle') {
        //pPr为段落样式；
        var id;
        try {
            id = node['attributes']['w\:val'];
        } catch (e) {
            return pStyleText;
        }
        this.pStyleArr.some((item)=> {
            if (item['id'] === id) {
                //如果是一级标题的话
                pStyleText += this.handleHeadNum(item['val']);
                return true;
            }
        });
        if (node.children) {
            pStyleText += this.traverseNodes(node.children, 'paragraphStyle')
        }
    } else if (node.type === 'element' && node.name === 'w:numPr') {
        if (node.children) {
            pStyleText += this.handleNumPr(node);
        }
    } else {
        log('[paragraphStyle]: type : ' + node.type + ' and name:' + node.name + ' not supported');
    }
    return pStyleText;
};
Translate.prototype.handleHeadNum = function (str) {
    switch (str) {
        case 'heading 1':
        case 'heading 2':
        case 'heading 3':
        case 'heading 4':
        case 'heading 5':
        case 'heading 6':
        return '__title__';
        default :
        log('[handleHeadNum]: style = ' + str + ' is not supported')
    }
    return '';
};
//处理数字的序列号（标题）
Translate.prototype.handleNumPr = function (node) {
    let ilvl, numId, numStr = '';

    node.children.forEach((item)=> {
        if (item['name'] === 'w:ilvl') {
            ilvl = item['attributes']['w:val'];
        } else if (item['name'] === 'w:numId') {
            numId = item['attributes']['w:val'];
        }
    });
    //numId如果等于0，说明这个序号已经被取消掉了
    if (numId == 0) {
        return numStr;
    }
    this.numberObj[numId].children.some((o)=> {
        if (o.ilvl === ilvl) {
            ilvl = parseInt(ilvl);
            if (!(this.numberContext[numId] && this.numberContext[numId][ilvl]) ){
                if(!Array.isArray(this.numberContext[numId])){
                    this.numberContext[numId] = [];
                }
                this.numberContext[numId][ilvl] = {
                    start: o.start,
                    current: parseInt(o.start),
                    format: o.numFmt
                }
            } else {
                this.numberContext[numId][ilvl].current++;
                for(let i=this.numberContext[numId].length-1;i>ilvl;i--){
                    this.numberContext[numId][i] = 0;
                }
            }
            numStr += this.getHeadNumber(this.numberContext[numId][ilvl].current, this.numberContext[numId][ilvl].format, o.lvlText);
            return true;
        }
    });
    return numStr;
}
Translate.prototype.getHeadNumber = function (num, fmt, lvlText) {
    const arr = lvlText.match(/\%\d+?/g);
    const getValue = function (fmt, num) {
        switch (fmt) {
            case 'decimal':
            return num;
            break;
            case 'upperLetter':
            return String.fromCharCode(+num+64);
            break;
            case 'lowerLetter':
            return  String.fromCharCode(+num+66);
            break;
            default :
            log(`[getHeadNumber]: ${fmt} style is not supported`);
            return '';
            break;
        }
    };
    if (arr.length > 1) {
        //log('暂不支持多级标题')
    };
    return lvlText.replace(/\%\d+?/, getValue(fmt, num));
}
Translate.prototype.parseDocument = function (callback) {
    const reader = XmlReader.create();
    reader.on('done', doc => {
        if (doc.name === 'w:document' && doc.type === 'element') {
            const body = _.find(doc.children, o=>o.type==='element' && o.name==='w:body');
            if (!body) {
                log('[parseDocument]: can not find w:body label, please checkout!')
            } else {
                this.parseBody(body.children);
            }
        } else {
            log('[parseDocument]: can not find w:document label, please checkout!');
        }
        callback(this.content);
    });
    reader.parse(this.docx);
};

module.exports = function(options, callback) {
    hasLog = options.hasLog;
    valid_list = options.list;
    valid_list.forEach(o=>{ o.list = getList(o.count, o.max) });
    const turn = new Translate('subject.docx');
    turn.parseDocument(callback);
}
