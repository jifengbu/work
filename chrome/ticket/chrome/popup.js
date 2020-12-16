$(function(){
    var state = $('#state');
    var interval = $('#interval');
    $('#start').click(function () {//给对象绑定事件
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {//获取当前tab
            //向tab发送请求
            chrome.tabs.sendMessage(tab[0].id, {
                action: "start",
                interval: $('#interval').val(),
            }, function (response) {
                console.log(response);
                response && state.html(response.state)
            });
        });
    });
    $('#stop').click(function () {
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {
               action: "stop"
            }, function (response) {
                response && state.html(response.state)
            });
        });
    })
})
