var options = {
    ANIMATE_DELAY: 0, //默认的动画延时
    ANIMATE_DURATION: 2, //默认的动画时长
    ANIMATE_TIMES: 1, //默认的动画播放次数
};
function rgbaToHex(rgba) {
    var list = rgba.replace(/\s*/g, '').match(/rgba?\((\d+),(\d+),(\d+),?(.*)?\)/);
    if (list) {
        return `#${(+list[1]).toString(16).padStart(2, '0')}${(+list[2]).toString(16).padStart(2, '0')}${(+list[3]).toString(16).padStart(2, '0')}${((list[4]||1)*100).toString(16).padStart(2, '0')}`.toUpperCase();
    }
    return '';
}
function uuid() {
    return Math.random().toString().substr(2, 2)
    + Math.random().toString().substr(2, 2)
    + Date.now().toString(36)
    + Math.random().toString().substr(2, 2)
    + Math.random().toString().substr(2, 2);
}
function fromatAnimate(animates) {
    var list = [];
    for (animate of animates) {
        if (animate.name) {
            var duration = !animate.duration || animate.duration==options.ANIMATE_DURATION ? '' : animate.duration;
            var delay = !animate.delay || animate.delay==options.ANIMATE_DELAY ? '' : animate.delay;
            var times = !animate.times || animate.times==options.ANIMATE_TIMES ? '' : animate.times;
            list.push(`${animate.name||''}:${duration}:${delay}:${times}:${animate.rely||''}`.replace(/:*$/, ''));
        }
    }
    return list.length ? ' a='+list.join('') : '';
}
function scalew(v) {
    return v;
    return parseInt(v * 375 / 320);
}
function scaleh(v) {
    return v;
    return parseInt(v * 667 / 486);
}
function getMarkdown(el) {
    var x = scalew(el.offsetLeft);
    var y = scaleh(el.offsetTop);
    var w = scalew(el.offsetWidth);
    var h = scaleh(el.offsetHeight);
    var elementBox = el.childNodes[0];
    var name = elementBox.style.animationName;
    var duration = parseFloat(elementBox.style.animationDuration);
    var delay = parseFloat(elementBox.style.animationDelay);
    var times = elementBox.style.animationIterationCount==='infinite'?0:parseFloat(elementBox.style.animationIterationCount);
    var animate = fromatAnimate([{ name, duration, delay, times }]);
    var target = elementBox.childNodes[0].childNodes[0];
    var isText = !target.src;
    var type = !isText ? ' img' : '';
    var style = '';
    if (isText) {
        if (target.childNodes[0] && target.childNodes[0].childNodes[0]) {
            if (!target.childNodes[0].childNodes[0] || !target.childNodes[0].childNodes[0].style) {
                target = target.childNodes[0];
            } else {
                target = target.childNodes[0].childNodes[0];
            }
        }
        var color = elementBox.style.color;
        if (color) {
            style = `${style}c=${rgbaToHex(color)} `;
        }
        var bgcolor = elementBox.style.backgroundColor;
        if (bgcolor) {
            style = `${style}bc=${rgbaToHex(bgcolor)} `;
        }
        var fontSize = target.style.fontSize;
        if (fontSize) {
            style = `${style}s=${parseFloat(fontSize)} `;
        }
        var fontWeight = target.style.fontWeight;
        if (fontWeight === 'bold') {
            style = `${style}b `;
        }
        var fontStyle = target.style.fontStyle;
        if (fontStyle === 'italic') {
            style = `${style}i `;
        }
        if (style) {
            style = ` ${style.trim()}`;
        }
    }

    if (elementBox.innerText || target.src) {
        var list = [];
        list.push(`::: fm${type} x=${x} y=${y} w=${w} h=${h}${style}${animate} id=${uuid()}`);
        list.push(isText ? elementBox.innerText : target.src);
        list.push(':::');
        list.push('');
        return list.join('\n');
    }
    return null;
}
function getPageTemplate(page) {
    var ul = $(page||'.main-page.z-current').find('.edit_wrapper>ul');
    var list = [];
    ul.children().each((index, el)=>{
        var tl = getMarkdown(el);
        tl && list.push(tl);
    });
    return list.join('\n');
}
function getTemplate(list, index, count, done) {
    list.push(getPageTemplate());
    if (index === count-1){
        console.log("已经获取第${index}页，完成");
        return done(list);
    }
    eqxiu.nextPage();
    console.log(`已经获取第${index}页，继续...`);
    setTimeout(function() {
        getTemplate(list, index+1, count, done)
    }, 100);
}

function getAllTemplate(callback) {
    var count = $('.main-page').size();
    console.log(`一共${count}页`);
    var list = [];
    getTemplate(list, 0, count, callback);
}
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "getTemplate") {
            getAllTemplate(function(list) {
                sendResponse({ result: list.join('======') });
            });
        }
    }
);
