/**
 * HTML PPT 模板 - 主要功能脚本
 * 
 * 实现PPT的核心功能：
 * - 幻灯片导航
 * - 主题切换
 * - 全屏控制
 * - 侧边栏管理
 * - 进度跟踪
 */

// 全局状态管理
const PPTState = {
    currentSlide: 0,
    totalSlides: 0,
    isFullscreen: false,
    currentTheme: 'apple',
    isSidebarOpen: false,
    isPresenting: false,
    settings: {},
    slides: []
};

// 初始化PPT
function initializePPT() {
    // 获取配置
    PPTState.settings = PPTConfig.settings;
    PPTState.slides = PPTConfig.slides;
    PPTState.totalSlides = PPTConfig.slides.length;
    PPTState.currentTheme = PPTConfig.theme;
    
    // 初始化界面
    updateSlideCounter();
    updateProgress();
    updateSlideTitle();
    
    // 绑定事件
    bindEvents();
    
    // 检查移动端
    checkMobileDevice();
    
    // 初始化主题
    applyTheme(PPTState.currentTheme);
    
    console.log('PPT initialized successfully');
}

// 绑定事件监听器
function bindEvents() {
    // 导航按钮
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.addEventListener('click', () => goToSlide(index));
    });
    
    // 全屏状态监听
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // 触摸手势支持
    if (PPTState.settings.touch) {
        bindTouchEvents();
    }
    
    // 窗口大小改变
    window.addEventListener('resize', handleResize);
}

// 触摸事件绑定
function bindTouchEvents() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    const slideContainer = document.querySelector('.slide-container');
    
    slideContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    });
    
    slideContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const deltaTime = endTime - startTime;
        
        // 检查是否为有效的滑动手势
        if (deltaTime < 500 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    });
}

// 幻灯片导航
function goToSlide(index) {
    if (index < 0 || index >= PPTState.totalSlides) return;
    
    const currentSlideElement = document.querySelector('.slide.active');
    const targetSlideElement = document.querySelector(`[data-slide="${index}"]`);
    
    if (!targetSlideElement) return;
    
    // 移除当前激活状态
    currentSlideElement?.classList.remove('active');
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加新的激活状态
    targetSlideElement.classList.add('active');
    document.querySelector(`[data-slide="${index}"]`).parentElement.classList.add('active');
    
    // 更新状态
    PPTState.currentSlide = index;
    
    // 更新界面
    updateSlideCounter();
    updateProgress();
    updateSlideTitle();
    
    // 播放动画
    playSlideAnimation(targetSlideElement);
}

function nextSlide() {
    const nextIndex = PPTState.currentSlide + 1;
    if (nextIndex < PPTState.totalSlides) {
        goToSlide(nextIndex);
    } else if (PPTState.settings.loop) {
        goToSlide(0);
    }
}

function prevSlide() {
    const prevIndex = PPTState.currentSlide - 1;
    if (prevIndex >= 0) {
        goToSlide(prevIndex);
    } else if (PPTState.settings.loop) {
        goToSlide(PPTState.totalSlides - 1);
    }
}

function firstSlide() {
    goToSlide(0);
}

function lastSlide() {
    goToSlide(PPTState.totalSlides - 1);
}

// 更新界面元素
function updateSlideCounter() {
    const currentElement = document.getElementById('current-slide');
    const totalElement = document.getElementById('total-slides');
    
    if (currentElement) currentElement.textContent = PPTState.currentSlide + 1;
    if (totalElement) totalElement.textContent = PPTState.totalSlides;
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const progress = ((PPTState.currentSlide + 1) / PPTState.totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

function updateSlideTitle() {
    const titleElement = document.getElementById('slide-title');
    if (titleElement && PPTState.slides[PPTState.currentSlide]) {
        titleElement.textContent = PPTState.slides[PPTState.currentSlide].title;
    }
}

// 播放幻灯片动画
function playSlideAnimation(slideElement) {
    const content = slideElement.querySelector('.slide-content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            content.style.transition = 'all 0.5s ease-out';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 50);
    }
}

// 侧边栏管理
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    PPTState.isSidebarOpen = !PPTState.isSidebarOpen;
    
    if (PPTState.isSidebarOpen) {
        sidebar.classList.add('open');
    } else {
        sidebar.classList.remove('open');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    PPTState.isSidebarOpen = false;
    sidebar.classList.remove('open');
}

// 全屏控制
function toggleFullscreen() {
    if (!PPTState.isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function handleFullscreenChange() {
    PPTState.isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
    
    const fullscreenBtn = document.querySelector('[onclick="toggleFullscreen()"]');
    if (fullscreenBtn) {
        const icon = fullscreenBtn.querySelector('i');
        if (PPTState.isFullscreen) {
            icon.className = 'fas fa-compress';
            fullscreenBtn.title = '退出全屏 (Esc)';
        } else {
            icon.className = 'fas fa-expand';
            fullscreenBtn.title = '全屏 (F11)';
        }
    }
}

// 主题管理
function switchTheme(themeName) {
    if (PPTConfig.themes[themeName]) {
        PPTState.currentTheme = themeName;
        applyTheme(themeName);
        updateThemePreview();
    }
}

function applyTheme(themeName) {
    const themeConfig = PPTConfig.themes[themeName];
    if (!themeConfig) return;
    
    const themeLink = document.getElementById('theme-css');
    if (themeLink) {
        themeLink.href = themeConfig.cssFile;
    }
    
    // 更新CSS变量
    document.documentElement.style.setProperty('--primary-color', themeConfig.primaryColor);
    document.documentElement.style.setProperty('--background-color', themeConfig.backgroundColor);
    document.documentElement.style.setProperty('--text-primary', themeConfig.textColor);
    
    console.log(`Theme switched to: ${themeName}`);
}

function toggleTheme() {
    const themes = Object.keys(PPTConfig.themes);
    const currentIndex = themes.indexOf(PPTState.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    switchTheme(nextTheme);
}

function updateThemePreview() {
    document.querySelectorAll('.theme-preview').forEach(preview => {
        preview.classList.remove('active-theme');
    });
    
    const activePreview = document.querySelector(`[data-theme="${PPTState.currentTheme}"]`);
    if (activePreview) {
        activePreview.classList.add('active-theme');
    }
}

// 帮助模态框
function showHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 欢迎界面
function startTutorial() {
    closeWelcome();
    // 可以在这里添加引导教程逻辑
}

function closeWelcome() {
    const overlay = document.getElementById('welcome-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// 设备检测
function checkMobileDevice() {
    const isMobile = window.innerWidth < PPTConfig.breakpoints.mobile;
    const isTablet = window.innerWidth < PPTConfig.breakpoints.tablet;
    
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('tablet', isTablet);
    
    // 移动端自动隐藏侧边栏
    if (isMobile && PPTState.settings.hideSidebarOnMobile) {
        closeSidebar();
    }
}

// 窗口大小改变处理
function handleResize() {
    checkMobileDevice();
    
    // 延迟执行以避免频繁调用
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // 重新计算布局
        updateSlideLayout();
    }, 250);
}

function updateSlideLayout() {
    // 这里可以添加布局更新逻辑
    console.log('Layout updated');
}

// 自动播放功能
function startAutoplay() {
    if (PPTState.settings.autoplay) {
        PPTState.autoplayInterval = setInterval(() => {
            nextSlide();
        }, PPTState.settings.autoplayInterval);
    }
}

function stopAutoplay() {
    if (PPTState.autoplayInterval) {
        clearInterval(PPTState.autoplayInterval);
        PPTState.autoplayInterval = null;
    }
}

// 功能按钮处理
function openFolder() {
    // 在实际项目中，这个功能可能需要特殊处理
    alert('请在文件管理器中打开项目文件夹');
}

function showAIHelp() {
    const aiPrompt = PPTConfig.aiPrompts.generatePrompt(
        PPTState.currentTheme,
        'business',
        '请根据我的具体需求创建演示文稿内容'
    );
    
    // 创建一个显示AI提示词的弹窗
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>AI 提示词助手</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p><strong>当前主题：</strong>${PPTConfig.themes[PPTState.currentTheme].name}</p>
                <div class="prompt-box">
                    <pre>${aiPrompt}</pre>
                </div>
                <button class="btn-primary" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent).then(() => alert('提示词已复制到剪贴板'))">
                    <i class="fas fa-copy"></i> 复制提示词
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function openReadme() {
    // 在新窗口中打开README文件
    window.open('README.md', '_blank');
}

// 导出功能
function exportToPDF() {
    window.print();
}

// 性能监控
function logPerformance() {
    if (performance.mark) {
        performance.mark('ppt-ready');
        
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        
        console.log(`PPT loaded in ${loadTime}ms`);
    }
}

// 错误处理
function handleError(error) {
    console.error('PPT Error:', error);
    
    // 在生产环境中，可以发送错误报告
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
            'description': error.message,
            'fatal': false
        });
    }
}

// 在页面加载完成后进行性能监控
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(logPerformance, 100);
});

// 全局错误处理
window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason);
});

// 导出到全局作用域
window.PPTState = PPTState;
window.initializePPT = initializePPT;
window.goToSlide = goToSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.firstSlide = firstSlide;
window.lastSlide = lastSlide;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.toggleFullscreen = toggleFullscreen;
window.switchTheme = switchTheme;
window.toggleTheme = toggleTheme;
window.showHelp = showHelp;
window.closeHelp = closeHelp;
window.startTutorial = startTutorial;
window.closeWelcome = closeWelcome;
window.openFolder = openFolder;
window.showAIHelp = showAIHelp;
window.openReadme = openReadme;
window.exportToPDF = exportToPDF; 