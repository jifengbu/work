function showAnimate(parent, node, animate, force) {
    if (animate) {
        let animates = animate.split(' ');
        if (force || !animates.find(o => /^after-/.test(o))) {
            node.classList.add('animated', ...animates);
            node.style.visibility = 'visible';
            function handleAnimationEnd() {
                node.classList.remove('animated', ...animates);
                node.removeEventListener('animationend', handleAnimationEnd);
                // 如果有依赖该节点的，执行依赖该节点的动画
                const index = $(node).data('index');
                if (index !== undefined) {
                    let after = 'after-'+index;
                    parent.children().each(function(){
                        let animate = $(this).data('animate');
                        if (animate) {
                            animates = animate.split(' ');
                            if (animates.find(o => o===after)) {
                                showAnimate(parent, this, animate, true);
                            }
                        }
                    });
                }
            }
            node.addEventListener('animationend', handleAnimationEnd);
        }
    }
}
function initPage($){
    $("#container").pageSlider({
        pageSelector:".page",
        loop:false,
        afterMove: function(el1, el2) {
            el1.children().each(function(){
                this.style.visibility = 'hidden';
            });
            el2.children().each(function(){
                showAnimate(el2, this, $(this).data('animate'));
            });
        },
        onLoaded: function(pages, curPage) {
            let el = $(pages[curPage]);
            el.children().each(function(){
                showAnimate(el, this, $(this).data('animate'));
            });
        },
    });
}
