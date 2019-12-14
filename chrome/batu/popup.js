$(function(){
    const content = $('#content');
    $('#submit').click(function () {//给对象绑定事件
        chrome.tabs.query({ active:true, currentWindow:true }, function (tab) {//获取当前tab
            //向tab发送请求
            chrome.tabs.sendMessage(tab[0].id, {
                action: "getTemplate",
            }, function (response) {
                content.html(response ? response.result : '没有任何数据')
            });
        });
    });
})
