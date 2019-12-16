$(function(){
    const content = $('#content');
    $('#submit').click(function () {//给对象绑定事件
        chrome.tabs.query({ active:true, currentWindow:true }, function (tab) {//获取当前tab
            //向tab发送请求
            chrome.tabs.sendMessage(tab[0].id, {
                action: "getTemplate",
            }, function (response) {
                if (response) {
                    $.ajax({
                        url: "http://localhost:4000/saveTemplate",
                        cache: false,
                        type: "POST",
                        data: { template: response.result },
                        dataType: "json"
                    }).done(function(msg) {
                        content.html(`写入文件路径: ${msg.path}`);
                    }).fail(function(msg) {
                        content.html('需要开启server里面的服务');
                    });
                } else {
                    content.html('错误的网页');
                }
            });
        });
    });
})
