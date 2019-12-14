
function getTemplate() {
    var ul = $('.z-current .edit_wrapper>ul');
    var list = [];
    ul.children().each((index, el)=>{
        var x = parseFloat(el.style.left);
        var y = parseFloat(el.style.top);
        var w = parseFloat(el.style.width);
        var h = parseFloat(el.style.height);
        var elementBox = el.childNodes[0];
        var name = elementBox.style.animationName;
        var delay = parseFloat(elementBox.style.animationDelay);
        var duration = parseFloat(elementBox.style.animationDuration);
        var loop = elementBox.style.animationIterationCount==='infinite'?-1:parseFloat(elementBox.style.animationIterationCount);
        var target = elementBox.childNodes[0].childNodes[0];
        var isText = !target.src;
        if (isText) {
            list.push(target.innerHTML);
        } else {
            list.push(target.src);
        }
    });
    console.log("=======", list);
    return 'famgyuinmmska';
}
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "getTemplate") {
            sendResponse({ result: getTemplate() });
        }
    }
);
