// 源码地址： https://github.com/Ali1213/docx2markdown
const fs = require('fs');
const AdmZip = require('adm-zip');
const XmlReader = require('xml-reader');
const _ = require('lodash');
let hasLog = false;
const inputOption = {};

const FILL_BLANK_SUBJECT = 0;
const JUDGEMENT_SUBJECT = 1;
const SINGLE_SELECT_SUBJECT = 2;
const MULTI_SELECT_SUBJECT = 3;
const ANSWER_QUESTION_SUBJECT = 4;

const valid_list = [
    { type: FILL_BLANK_SUBJECT, list: [1,2,3,4,5,31,32,33,34,35] },
    { type: JUDGEMENT_SUBJECT, list: [1,2,3,4,5,21,22,23,24,25] },
    { type: SINGLE_SELECT_SUBJECT, list: [1,2,3,4,5,11,12,13,14,15] },
    { type: MULTI_SELECT_SUBJECT, list: [1,2,3,4,5,6,7,8,9,10] },
    { type:ANSWER_QUESTION_SUBJECT, list: [1,2] },
];
let current_index = -1;

function parseStyle(xmlStr){
    return xmlStr.match(/<w:style w:type\=\"paragraph\"[\s\S]+?<\/w:style>/ig).map((item)=> {
        var iRe = /w:styleid\=\"([\s\S]+?)\"[\s\S]+?w:name[\s\S]+?w:val\=\"([\s\S]+?)\"[\s\S]+?/ig;
        var match = iRe.exec(item);
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
                ilvlID: match2[1],
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
function log(...args) {
    hasLog && console.log(...args);
}

var Translate = function (filePath) {
    this.zip = new AdmZip(filePath);
    this.docx = this.zip.readAsText('word/document.xml');

    //存储，记录比标题序列号
    this.numberContext = {};
    this.pStyleArr = parseStyle(this.zip.readAsText('word/styles.xml'));
    this.numberObj = parseNumber(this.zip.readAsText('word/numbering.xml'));

    //准备在之后将所有的页面数据存储在这个object里面，然后再次输出
    this.contentObj = {
        head: {},
        body: [],
        footer: {},
        comment: {}
    }
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
                console.log("=======", current_index);
                this.content += paragraph + '\n';
            }
        } else {
            log('[parseBody]: type : ' + item.type + ' And name:' + item.name + ' not supported');
        }
    })
};
//处理段落
Translate.prototype.paragraph = function (node) {
    var self = this;
    var pObj = {};
    var pText = '';

    if (node.type === 'element' && node.name === 'w:pPr') {
        //pPr为段落样式；
        if (node.children) {
            const no = self.traverseNodes(node.children, 'paragraphStyle');
            if (no === '__title__') {
                this.skip = false;
                pText += '';
            } else if (/^\d+\. $/.test(no)) {
                const num = +(no.match(/\d+/)[0]);
                if (valid_list[current_index].list.indexOf(num) === -1) {
                    this.skip = true;
                } else {
                    this.skip = false;
                    pText += no;
                    inputOption.index = 0;
                    inputOption.size = 0;
                }
            } else if (!this.skip){
                pText +=  no;
            }
        }
    } else if (node.type === 'element' && node.name === 'w:t') {
        if (node.children) {
            if (node.attributes['xml:space'] === 'preserve' && current_index === 0) {
                if (!this.skip) {
                    if (valid_list[current_index].type === FILL_BLANK_SUBJECT) {
                        inputOption.size++;
                    } else {
                        pText += '    ';
                    }
                }
            } else {
                pText += self.traverseNodes(node.children, 'paragraph');
            }
        }
    } else if (node.type === 'element' && node.name === 'w:r') {
        if (node.children) {
            pText += self.traverseNodes(node.children, 'paragraph');
        }
    } else if (node.type === 'text' && node.name === '') {
        //文本文档
        if (!this.skip) {
            pText += (inputOption.size > 0 ? `<input data-index=${inputOption.index} data-size=${inputOption.size} />` : '') + node.value;
            inputOption.continue = false;
            inputOption.size = 0;
            inputOption.index++;
        }
    } else {
        log('[paragraph]: type : ' + node.type + ' And name:' + node.name + ' not supported');
    }
    return pText;
};
Translate.prototype.paragraphStyle = function (node) {
    var self = this;
    var pStyleText = '';
    if (node.type === 'element' && node.name === 'w:pStyle') {
        //pPr为段落样式；
        var id;
        try {
            id = node['attributes']['w\:val'];
        } catch (e) {
            return pStyleText;
        }
        self.pStyleArr.some((item)=> {
            if (item['id'] === id) {
                //如果是一级标题的话
                pStyleText += self.handleHeadNum(item['val']);
                return true;
            }
        });
        if (node.children) {
            pStyleText += self.traverseNodes(node.children, 'paragraphStyle')
        }
    } else if (node.type === 'element' && node.name === 'w:numPr') {
        if (node.children) {
            pStyleText += self.handleNumPr(node);
        }
    } else {
        log('[paragraphStyle]: type : ' + node.type + ' And name:' + node.name + ' not supported');
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
        current_index++;
        return '__title__';
        default :
        log('[handleHeadNum]: style = ' + str + ' is not supported')
    }
    return '';
};
//处理数字的序列号（标题）
Translate.prototype.handleNumPr = function (node) {
    var self = this;
    var numStr = '';
    var ilvlID;
    var id;

    node.children.forEach((item)=> {
        if (item['name'] === 'w:ilvl') {
            ilvlID = item['attributes']['w:val'];
        }
        if (item['name'] === 'w:numId') {
            id = item['attributes']['w:val'];
        }
    });

    //numId如果等于0，说明这个序号已经被取消掉了
    if (id == 0) {
        return numStr;
    }

    try {
        self.numberObj[id].children.some((o)=> {
            if (o.ilvlID === ilvlID) {
                ilvlID = parseInt(ilvlID);
                if (!(self.numberContext[id] && self.numberContext[id][ilvlID]) ){
                    if(!Array.isArray(self.numberContext[id])){
                        // self.numberContext[id] = new Array(20).fill(0);
                        self.numberContext[id] = [];
                    }
                    self.numberContext[id][ilvlID] = {
                        start: o.start,
                        current: parseInt(o.start),
                        format: o.numFmt
                    }
                } else {
                    self.numberContext[id][ilvlID].current++;
                    for(let i=self.numberContext[id].length-1;i>ilvlID;i--){
                        self.numberContext[id][i] = 0;
                    }
                }
                numStr += self.getHeadNumber(self.numberContext[id][ilvlID].current, self.numberContext[id][ilvlID].format, o.lvlText);
                return true;
            }
        })
    } catch (e) {
        // log(e)
        // log('下面标题格式暂不支持');
        // log(node);
    }
    return numStr;
}
Translate.prototype.getHeadNumber = function (num, fmt, lvlText) {
    var self = this;
    var str = '';
    var arr = lvlText.match(/\%\d+?/g);
    var getValue = function (fmt, num) {
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
    str += lvlText.replace(/\%\d+?/, getValue(fmt, num));
    return str+' ';
}
Translate.prototype.parseDocument = function (callback) {
    var self = this;
    const reader = XmlReader.create();
    reader.on('done', doc => {
        if (doc.name === 'w:document' && doc.type === 'element') {
            const body = _.find(doc.children, o=>o.type==='element' && o.name==='w:body');
            if (!body) {
                log('[parseDocument]: can not find w:body label, please checkout!')
            } else {
                self.parseBody(body.children);
            }
        } else {
            log('[parseDocument]: can not find w:document label, please checkout!');
        }
        callback(self.content);
    });
    reader.parse(self.docx);
};


function main () {
    hasLog = false;
    var turn = new Translate('total.docx');
    turn.parseDocument((html)=>{
        console.log("=======", html);
    });
}

main();
