function animateCSS(node, animate, callback) {
    if (animate) {
        var animates = animate.split(' ');
        node.classList.add('animated', ...animates);
        node.classList.remove('hide');
        function handleAnimationEnd() {
            node.classList.remove('animated', ...animates);
            node.removeEventListener('animationend', handleAnimationEnd);
            typeof callback === 'function' && callback();
        }
        node.addEventListener('animationend', handleAnimationEnd);
    }
}
function initPage($){
    $("#container").pageSlider({
        pageSelector:".page",
        loop:false,
        afterMove: function(el1, el2) {
            el1.children().each(function(){
                this.classList.add('hide');
            });
            el2.children().each(function(){
                animateCSS(this, $(this).data('animate'));
            });
        },
        onLoaded: function(pages, curPage) {
            $(pages[curPage]).children().each(function(){
                animateCSS(this, $(this).data('animate'));
            });
        },
    });
}
