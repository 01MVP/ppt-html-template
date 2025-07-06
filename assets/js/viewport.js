(function(global){
    'use strict';

    /**
     * 视口与缩放工具模块
     * 仅暴露 adjustSlideViewport / adjustIframeContent / resetIframeScaling
     * 方便在其他脚本中按需调用，提升可维护性
     */

    /** 动态调整 slide-viewport 尺寸，防止溢出并保持 16:9 比例 */
    function adjustSlideViewport(){
        const slideContainer = document.querySelector('.slide-container');
        const slideViewport  = document.querySelector('.slide-viewport');
        if(!slideContainer || !slideViewport) return;

        const rect          = slideContainer.getBoundingClientRect();
        const isMobile      = window.innerWidth < 768;
        const isSmallWindow = window.innerWidth < 1200;

        let padding;
        if(rect.width < 500){          padding = 4;  }
        else if(isMobile){             padding = 8;  }
        else if(isSmallWindow){        padding = 16; }
        else {                        padding = 24; }
        slideContainer.style.padding = `${padding}px`;

        const maxHeight = Math.max(200, rect.height - padding*2);
        slideViewport.style.maxHeight = `${maxHeight}px`;

        const maxWidthByRatio = maxHeight * (16/9);
        const availableWidth  = rect.width  - padding*2;
        const maxWidth        = Math.min(availableWidth, maxWidthByRatio);
        slideViewport.style.maxWidth = `${maxWidth}px`;
        slideViewport.style.width    = availableWidth < maxWidthByRatio ? `${availableWidth}px` : '100%';

        adjustIframeContent();
    }

    /** 根据用户缩放倍数整体缩放 slide-viewport（含阴影边框） */
    function adjustIframeContent(){
        const slideViewport = document.querySelector('.slide-viewport');
        if(!slideViewport) return;
        const scale = global.PPTState?.userScaleMultiplier || 1.0;
        if(scale !== 1){
            slideViewport.style.transform       = `scale(${scale})`;
            slideViewport.style.transformOrigin = 'top left';
        } else {
            slideViewport.style.transform = 'none';
        }
    }

    /** 全屏模式退出后重置任何缩放 transform */
    function resetIframeScaling(){
        const slideViewport = document.querySelector('.slide-viewport');
        if(slideViewport){
            slideViewport.style.transform       = 'none';
            slideViewport.style.transformOrigin = 'initial';
        }
    }

    // 向全局暴露 API
    global.PPTViewport = {
        adjustSlideViewport,
        adjustIframeContent,
        resetIframeScaling
    };
})(window); 