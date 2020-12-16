var button = $('#button');
var running = false;
var timer;
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "start") {
            if (!timer) {
                timer = setInterval(function() {
                    button.click();
                }, parseInt(request.interval) || 10);
                sendResponse({state: '开始成功！'});
            } else {
                sendResponse({state:'已经开始！'});
            }
        }
        if (request.action == "stop") {
            if (timer) {
                clearInterval(timer);
                timer = null;
                sendResponse({state:'停止成功！'});
            } else {
                sendResponse({state:'已经停止！'});
            }
        }
    }
);
