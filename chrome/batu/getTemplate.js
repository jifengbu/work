var options = {
    ANIMATE_DELAY: 0, //默认的动画延时
    ANIMATE_DURATION: 2, //默认的动画时长
    ANIMATE_TIMES: 1, //默认的动画播放次数
};
function uuid() {
    return Math.random().toString().substr(2, 2)
    + Math.random().toString().substr(2, 2)
    + Date.now().toString(36)
    + Math.random().toString().substr(2, 2)
    + Math.random().toString().substr(2, 2);
}
function fromatAnimate(animates) {
    const list = [];
    for (animate of animates) {
        if (animate.name) {
            const duration = !animate.duration || animate.duration==options.ANIMATE_DURATION ? '' : animate.duration;
            const delay = !animate.delay || animate.delay==options.ANIMATE_DELAY ? '' : animate.delay;
            const times = !animate.times || animate.times==options.ANIMATE_TIMES ? '' : animate.times;
            list.push(`${animate.name||''}:${duration}:${delay}:${times}:${animate.rely||''}`.replace(/:*$/, ''));
        }
    }
    return list.length ? ' a='+list.join('') : '';
}
function getMarkdown(el) {
    // var x = parseFloat(el.style.left);
    // var y = parseFloat(el.style.top);
    // var w = parseFloat(el.style.width);
    // var h = parseFloat(el.style.height);
    var x = el.offsetLeft;
    var y = el.offsetTop;
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    var elementBox = el.childNodes[0];
    var name = elementBox.style.animationName;
    var duration = parseFloat(elementBox.style.animationDuration);
    var delay = parseFloat(elementBox.style.animationDelay);
    var times = elementBox.style.animationIterationCount==='infinite'?0:parseFloat(elementBox.style.animationIterationCount);
    const animate = fromatAnimate([{ name, duration, delay, times }]);

    var target = elementBox.childNodes[0].childNodes[0];
    var isText = !target.src;
    const type = !isText ? ' img' : '';
    let style = '';
    if (isText) {
        const fontSize = el.style.fontSize;
        if (fontSize) {
            style = `${style}s=${parseFloat(fontSize)} `;
        }
        const fontWeight = el.style.fontWeight;
        if (fontWeight === 'bold') {
            style = `${style}b `;
        }
        const fontStyle = el.style.fontStyle;
        if (fontStyle === 'italic') {
            style = `${style}i `;
        }
        const color = el.style.color;
        if (color) {
            style = `${style}c=${utils.rgbaToHex(color)} `;
        }
        const bgcolor = el.style.backgroundColor;
        if (bgcolor) {
            style = `${style}bc=${utils.rgbaToHex(bgcolor)} `;
        }
        if (style) {
            style = ` ${style.trim()}`;
        }
    }

    const text = [];
    text.push(`::: fm${type} x=${x} y=${y} w=${w} h=${h}${style}${animate} id=${uuid()}`);
    text.push(isText ? target.innerText : target.src);
    text.push(':::');
    return text.join('\n');
}
function getTemplate() {
    var ul = $('.z-current .edit_wrapper>ul');
    var list = [];
    ul.children().each((index, el)=>{
        list.push(getMarkdown(el));
    });
    return list.join('\n\n');
}
getTemplate()
