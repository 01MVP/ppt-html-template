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
    PPTState.currentTheme = PPTConfig.theme;
    
    // 初始化sidebar状态 - 默认展开
    PPTState.isSidebarOpen = true;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.add('open');
    }
    
    // 恢复用户选择的文件夹
    restoreUserFolder();
    
    // 加载幻灯片内容
    loadSlideContent();
    
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
    
    // 初始化slide viewport尺寸
    setTimeout(() => {
        adjustSlideViewport();
    }, 100);
    
    // 也在稍后再次调整，确保iframe内容加载完成后正确缩放
    setTimeout(() => {
        adjustSlideViewport();
    }, 1000);
    
    // 初始化缩放控制器
    initializeZoomController();
    
    console.log('PPT initialized successfully');
}

// 加载幻灯片内容
function loadSlideContent() {
    try {
        // 使用slideFiles配置来加载HTML文件
        if (PPTConfig.slideFiles && PPTConfig.slideFiles.files) {
            const slideFiles = PPTConfig.slideFiles.files;
            
            // 构建幻灯片信息数组
            const slides = slideFiles.map((filename, index) => {
                // 从文件名提取标题
                let title = `幻灯片 ${index + 1}`;
                const nameWithoutExt = filename.replace('.html', '');
                const parts = nameWithoutExt.split('-');
                if (parts.length > 1) {
                    title = parts.slice(1).join(' ').replace(/[-_]/g, ' ');
                }
                
                return {
                    id: `slide-${index}`,
                    title: title,
                    filename: filename,
                    filepath: PPTConfig.slideFiles.basePath + filename,
                    notes: '' // 备注需要从iframe中获取，先设为空
                };
            });
            
            // 更新slides数组信息
            updateSlidesInfo(slides);
            
            // 设置第一张幻灯片
            if (slides.length > 0) {
                loadSlideByIndex(0);
            }
            
            console.log('Slide files loaded:', slides.length + ' slides');
            return;
        }
        
        throw new Error('没有找到可用的幻灯片文件配置');
        
    } catch (error) {
        console.error('加载幻灯片内容时出错:', error);
        // 加载失败时显示错误信息
        showErrorMessage('无法加载幻灯片内容: ' + error.message);
    }
}

// 通过索引加载幻灯片
function loadSlideByIndex(index) {
    if (index < 0 || index >= PPTState.totalSlides) return;
    
    const slide = PPTState.slides[index];
    const slideFrame = document.getElementById('slide-frame');
    
    if (slideFrame && slide) {
        slideFrame.src = slide.filepath;
        PPTState.currentSlide = index;
        
        // 更新界面
        updateSlideCounter();
        updateProgress();
        updateSlideTitle();
        updateActiveNavigation();
        
        // 更新侧边栏缩略图当前状态
        if (window.sidebarThumbnails) {
            window.sidebarThumbnails.currentSlide = index;
            window.sidebarThumbnails.updateActiveSlide();
        }
        
        // iframe加载完成后的处理
        setTimeout(() => {
            // 重新应用缩放以确保新加载的内容正确显示
            adjustSlideViewport();
        }, 500);
        
        console.log('Loaded slide:', slide.filename);
    }
}



// 解析幻灯片内容
function parseSlideContent(htmlContent, filename, index) {
    // 创建临时DOM元素来解析内容
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // 提取标题
    let title = `幻灯片 ${index + 1}`;
    
    // 从文件名提取标题
    if (PPTConfig.slideFiles.titleExtraction.fromFilename) {
        const nameWithoutExt = filename.replace('.html', '');
        const parts = nameWithoutExt.split('-');
        if (parts.length > 1) {
            title = parts.slice(1).join('-').replace(/[-_]/g, ' ');
        }
    }
    
    // 从内容中提取标题
    if (PPTConfig.slideFiles.titleExtraction.fromContent) {
        const h1 = tempDiv.querySelector('h1');
        const h2 = tempDiv.querySelector('h2');
        if (h1) {
            title = h1.textContent.trim();
        } else if (h2) {
            title = h2.textContent.trim();
        }
    }
    
    return {
        id: `slide-${index}`,
        title: title,
        content: tempDiv.innerHTML,
        filename: filename
    };
}

// 生成幻灯片HTML
function generateSlidesHTML(slides) {
    return slides.map((slide, index) => {
        const activeClass = index === 0 ? 'active' : '';
        return `
            <div class="slide ${activeClass}" data-slide="${index}" data-title="${slide.title}">
                ${slide.content}
            </div>
        `;
    }).join('');
}

// 更新幻灯片信息
function updateSlidesInfo(slidesData) {
    PPTState.slides = slidesData;
    PPTState.totalSlides = slidesData.length;
    PPTState.currentSlide = 0;
    
    // 通知新的侧边栏缩略图管理器更新
    if (window.sidebarThumbnails) {
        setTimeout(() => {
            window.sidebarThumbnails.updateSidebarNavigation();
        }, 100);
    }
}

// 更新侧边栏导航（现在由sidebar-thumbnails.js接管）
function updateSidebarNavigation() {
    // 此函数已被新的侧边栏缩略图管理器替代
    // 如果新的管理器还未初始化，则尝试通知它
    if (window.sidebarThumbnails) {
        window.sidebarThumbnails.updateSidebarNavigation();
    }
}

// 重新绑定导航事件
function bindNavigationEvents() {
    // 清除现有的导航事件监听器
    document.querySelectorAll('.nav-item').forEach(item => {
        item.replaceWith(item.cloneNode(true));
    });
    
    // 重新绑定导航事件
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.addEventListener('click', () => goToSlide(index));
    });
}

// 显示错误信息
function showErrorMessage(message) {
    const slideFrame = document.getElementById('slide-frame');
    if (slideFrame) {
        // 创建一个临时的错误页面
        const errorContent = `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>加载错误</title>
                <style>
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 40px; background: #f8f9fa; }
                    .error-container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                    h2 { color: #dc3545; margin-bottom: 20px; }
                    .solution { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .solution h4 { color: #007bff; margin-bottom: 10px; }
                    ul { list-style: none; padding: 0; }
                    li { padding: 8px 0; color: #6c757d; }
                    li:before { content: "✓ "; color: #28a745; font-weight: bold; margin-right: 8px; }
                    code { background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-family: 'Consolas', monospace; }
                    .browser-tip { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .browser-tip h4 { color: #856404; margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h2>⚠️ 无法加载幻灯片</h2>
                    <p>${message}</p>
                    <div class="browser-tip">
                        <h4>💡 这可能是浏览器安全限制</h4>
                        <p>部分浏览器会阻止本地文件访问。推荐使用以下浏览器：</p>
                        <ul style="margin-left: 20px;">
                            <li><strong>Chrome浏览器</strong> - 兼容性最好</li>
                            <li><strong>Firefox浏览器</strong> - 支持良好</li>
                            <li><strong>Edge浏览器</strong> - 微软推荐</li>
                        </ul>
                    </div>
                    <div class="solution">
                        <h4>🚀 快速解决方案：</h4>
                        <ol style="list-style: decimal; margin-left: 20px; color: #6c757d;">
                            <li>点击文件夹选择器，先切换回"slides (默认)"</li>
                            <li>如果还是不行，尝试刷新页面</li>
                            <li>确保项目文件夹完整，所有文件都在</li>
                            <li>尝试用不同的浏览器打开</li>
                        </ol>
                    </div>
                    <p><strong>💡 小贴士：</strong>这是零依赖项目，直接双击 <code>index.html</code> 即可使用，无需安装任何软件！</p>
                </div>
            </body>
            </html>
        `;
        
        slideFrame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(errorContent);
    }
    
    PPTState.slides = [{
        id: 'error',
        title: '错误',
        layout: 'content'
    }];
    PPTState.totalSlides = 1;
    PPTState.currentSlide = 0;
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
    loadSlideByIndex(index);
}

// 更新导航项的激活状态
function updateActiveNavigation() {
    // 通知新的侧边栏缩略图管理器更新激活状态
    if (window.sidebarThumbnails) {
        window.sidebarThumbnails.updateActiveSlide();
    }
}

function nextSlide() {
    // 如果有重新排列的幻灯片顺序，使用自定义顺序
    if (window.sidebarThumbnails && window.sidebarThumbnails.slideOrder) {
        const currentOrder = window.sidebarThumbnails.slideOrder;
        const currentPos = currentOrder.indexOf(PPTState.currentSlide);
        
        if (currentPos !== -1) {
            const nextPos = currentPos + 1;
            if (nextPos < currentOrder.length) {
                goToSlide(currentOrder[nextPos]);
            } else if (PPTState.settings.loop) {
                goToSlide(currentOrder[0]);
            }
            return;
        }
    }
    
    // 默认顺序
    const nextIndex = PPTState.currentSlide + 1;
    if (nextIndex < PPTState.totalSlides) {
        goToSlide(nextIndex);
    } else if (PPTState.settings.loop) {
        goToSlide(0);
    }
}

function prevSlide() {
    // 如果有重新排列的幻灯片顺序，使用自定义顺序
    if (window.sidebarThumbnails && window.sidebarThumbnails.slideOrder) {
        const currentOrder = window.sidebarThumbnails.slideOrder;
        const currentPos = currentOrder.indexOf(PPTState.currentSlide);
        
        if (currentPos !== -1) {
            const prevPos = currentPos - 1;
            if (prevPos >= 0) {
                goToSlide(currentOrder[prevPos]);
            } else if (PPTState.settings.loop) {
                goToSlide(currentOrder[currentOrder.length - 1]);
            }
            return;
        }
    }
    
    // 默认顺序
    const prevIndex = PPTState.currentSlide - 1;
    if (prevIndex >= 0) {
        goToSlide(prevIndex);
    } else if (PPTState.settings.loop) {
        goToSlide(PPTState.totalSlides - 1);
    }
}

function firstSlide() {
    // 如果有重新排列的幻灯片顺序，跳转到第一个
    if (window.sidebarThumbnails && window.sidebarThumbnails.slideOrder) {
        const currentOrder = window.sidebarThumbnails.slideOrder;
        if (currentOrder.length > 0) {
            goToSlide(currentOrder[0]);
            return;
        }
    }
    
    goToSlide(0);
}

function lastSlide() {
    // 如果有重新排列的幻灯片顺序，跳转到最后一个
    if (window.sidebarThumbnails && window.sidebarThumbnails.slideOrder) {
        const currentOrder = window.sidebarThumbnails.slideOrder;
        if (currentOrder.length > 0) {
            goToSlide(currentOrder[currentOrder.length - 1]);
            return;
        }
    }
    
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

// 更新演讲者备注


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
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const mainToggleBtns = document.querySelectorAll('[onclick="toggleSidebar()"]');
    
    PPTState.isSidebarOpen = !PPTState.isSidebarOpen;
    
    if (PPTState.isSidebarOpen) {
        sidebar.classList.add('open');
        // Sidebar内的关闭按钮显示X
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        }
        // 主控制栏的菜单按钮显示X
        mainToggleBtns.forEach(btn => {
            if (btn !== toggleBtn && btn.closest('.control-bar')) {
                btn.innerHTML = '<i class="fas fa-times"></i>';
            }
        });
    } else {
        sidebar.classList.remove('open');
        // Sidebar内的关闭按钮显示菜单图标
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
        // 主控制栏的菜单按钮显示菜单图标
        mainToggleBtns.forEach(btn => {
            if (btn !== toggleBtn && btn.closest('.control-bar')) {
                btn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    PPTState.isSidebarOpen = false;
    sidebar.classList.remove('open');
}

// 修复PDF导出功能
function showPresentationTimer() {
    // 显示演示计时器
    if (window.presentationTimer) {
        window.presentationTimer.show();
    } else {
        showToast('演示计时器功能正在开发中', 2000);
    }
}

// 重置幻灯片顺序
function resetSlideOrder() {
    // 重新加载幻灯片内容，恢复默认顺序
    loadSlideContent();
    showToast('幻灯片顺序已重置', 2000);
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
    
    // 全屏时隐藏除幻灯片外的所有UI元素
    const body = document.body;
    if (PPTState.isFullscreen) {
        body.classList.add('fullscreen-mode');
        // 全屏时重置iframe缩放
        resetIframeScaling();
    } else {
        body.classList.remove('fullscreen-mode');
        // 退出全屏时重新应用缩放
        setTimeout(() => {
            adjustSlideViewport();
        }, 100);
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
    if (isMobile) {
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
        // 调整slide viewport尺寸
        adjustSlideViewport();
    }, 150); // 减少延迟，让响应更快
}

function updateSlideLayout() {
    // 这里可以添加布局更新逻辑
    console.log('Layout updated');
}

// 调整slide viewport尺寸以适应窗口
function adjustSlideViewport() {
    const slideContainer = document.querySelector('.slide-container');
    const slideViewport = document.querySelector('.slide-viewport');
    
    if (!slideContainer || !slideViewport) return;
    
    // 重置padding以获取真实的容器尺寸
    slideContainer.style.padding = '0px';
    
    // 获取容器的原始尺寸
    const containerRect = slideContainer.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const isSmallWindow = window.innerWidth < 1200;
    
    // 动态调整padding，窗口越小padding越小
    const isVerySmall = containerRect.width < 500 || containerRect.height < 400;
    let padding;
    
    if (isVerySmall) {
        padding = Math.max(2, containerRect.width * 0.005); // 极小窗口使用最小padding
    } else if (isMobile) {
        padding = Math.max(4, Math.min(8, containerRect.width * 0.01)); // 移动端使用极小的padding
    } else if (isSmallWindow) {
        padding = Math.max(8, Math.min(16, containerRect.width * 0.015)); // 小窗口使用较小的padding
    } else {
        padding = Math.max(16, Math.min(24, containerRect.width * 0.02)); // 大窗口使用正常的padding
    }
    
    // 应用计算出的padding
    slideContainer.style.padding = `${padding}px`;
    
    // 计算可用空间
    const availableWidth = containerRect.width - (padding * 2);
    const availableHeight = containerRect.height - (padding * 2);
    
    // 调整最小尺寸限制，让小窗口能显示更多内容
    let minWidth, minHeight;
    if (isVerySmall) {
        minWidth = 150;
        minHeight = 84; // 150 * 9/16 = 84.375
    } else if (isMobile) {
        minWidth = 200;
        minHeight = 112; // 200 * 9/16 = 112.5
    } else {
        minWidth = 240;
        minHeight = 135; // 240 * 9/16 = 135
    }
    
    // 确保有足够的空间
    if (availableWidth < minWidth || availableHeight < minHeight) {
        // 如果空间不足，使用更小的padding
        if (containerRect.width < 300) {
            padding = 1; // 超小窗口使用1px padding
        } else {
            padding = Math.max(2, padding / 2);
        }
        slideContainer.style.padding = `${padding}px`;
        
        // 对于超小窗口，进一步降低最小尺寸
        if (containerRect.width < 300) {
            minWidth = Math.max(100, containerRect.width - 10);
            minHeight = Math.max(56, minWidth * 9 / 16);
        }
    }
    
    // 重新计算可用空间
    const finalAvailableWidth = containerRect.width - (padding * 2);
    const finalAvailableHeight = containerRect.height - (padding * 2);
    
    // 计算16:9比例下的理想尺寸
    const aspectRatio = 16 / 9;
    let targetWidth = finalAvailableWidth;
    let targetHeight = finalAvailableWidth / aspectRatio;
    
    // 如果高度超出可用空间，则以高度为准
    if (targetHeight > finalAvailableHeight) {
        targetHeight = finalAvailableHeight;
        targetWidth = finalAvailableHeight * aspectRatio;
    }
    
    // 确保尺寸不超出可用空间
    targetWidth = Math.min(targetWidth, finalAvailableWidth);
    targetHeight = Math.min(targetHeight, finalAvailableHeight);
    
    // 再次校验最小尺寸
    targetWidth = Math.max(minWidth, targetWidth);
    targetHeight = Math.max(minHeight, targetHeight);
    
    // 最终校验比例
    const currentRatio = targetWidth / targetHeight;
    if (Math.abs(currentRatio - aspectRatio) > 0.01) {
        if (currentRatio > aspectRatio) {
            targetWidth = targetHeight * aspectRatio;
        } else {
            targetHeight = targetWidth / aspectRatio;
        }
    }
    
    // 应用尺寸
    slideViewport.style.width = Math.round(targetWidth) + 'px';
    slideViewport.style.height = Math.round(targetHeight) + 'px';
    
    // 应用iframe内容缩放
    applyIframeScaling(targetWidth, targetHeight);
    
    // 计算利用率
    const utilizationWidth = (targetWidth / containerRect.width * 100).toFixed(1);
    const utilizationHeight = (targetHeight / containerRect.height * 100).toFixed(1);
    
    console.log(`Adjusted viewport: ${Math.round(targetWidth)}x${Math.round(targetHeight)} (${utilizationWidth}% × ${utilizationHeight}%), padding: ${padding}px`);
}

// 应用iframe内容缩放
function applyIframeScaling(targetWidth, targetHeight) {
    const iframe = document.getElementById('slide-frame');
    if (!iframe) return;
    
    // 根据目标尺寸智能选择标准尺寸 - 使用更大的尺寸以显示更多内容
    let standardWidth, standardHeight;
    
    // 使用更大的标准尺寸以确保能看到完整页面
    if (targetWidth < 300) {
        standardWidth = 1400;
        standardHeight = 787;
    } else if (targetWidth < 500) {
        standardWidth = 1600;
        standardHeight = 900;
    } else {
        standardWidth = 1920;
        standardHeight = 1080;
    }
    
    // 获取用户设置的缩放倍数
    const userScaleMultiplier = window.PPTState?.userScaleMultiplier || 1.0;
    
    // 计算缩放比例
    const scaleX = targetWidth / standardWidth;
    const scaleY = targetHeight / standardHeight;
    
    // 使用较小的缩放比例以确保内容完全可见
    const baseScale = Math.min(scaleX, scaleY);
    
    // 应用用户自定义的缩放倍数
    const scale = baseScale * userScaleMultiplier;
    
    // 应用一个最小缩放限制，避免内容过小
    const minScale = 0.05;
    const finalScale = Math.max(scale, minScale);
    
    // 计算缩放后的实际尺寸
    const scaledWidth = standardWidth * finalScale;
    const scaledHeight = standardHeight * finalScale;
    
    // 计算居中的偏移量
    const offsetX = (targetWidth - scaledWidth) / 2;
    const offsetY = (targetHeight - scaledHeight) / 2;
    
    // 应用CSS变换
    iframe.style.width = standardWidth + 'px';
    iframe.style.height = standardHeight + 'px';
    iframe.style.transform = `scale(${finalScale}) translate(${offsetX/finalScale}px, ${offsetY/finalScale}px)`;
    iframe.style.transformOrigin = '0 0';
    iframe.style.overflow = 'hidden';
    
    console.log(`Applied iframe scaling: ${finalScale.toFixed(3)}x (${standardWidth}x${standardHeight} → ${Math.round(scaledWidth)}x${Math.round(scaledHeight)}), user multiplier: ${userScaleMultiplier}`);
}

// 重置iframe缩放（用于全屏模式）
function resetIframeScaling() {
    const iframe = document.getElementById('slide-frame');
    if (!iframe) return;
    
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.transform = 'none';
    iframe.style.transformOrigin = 'initial';
    
    console.log('Reset iframe scaling to normal');
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

// 导出功能 - 现在由pdf-export.js处理

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
            console.error('PPT系统错误:', error);
    
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

// 缩放控制器功能
function initializeZoomController() {
    // 新的sidebar缩放控制器
    const sidebarZoomOutBtn = document.getElementById('sidebar-zoom-out');
    const sidebarZoomInBtn = document.getElementById('sidebar-zoom-in');
    const sidebarZoomResetBtn = document.getElementById('sidebar-zoom-reset');
    const sidebarZoomDisplay = document.getElementById('sidebar-zoom-display');
    
    // 兼容旧的缩放控制器（如果存在）
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const zoomDisplay = document.getElementById('zoom-display');
    
    if (!sidebarZoomOutBtn || !sidebarZoomInBtn || !sidebarZoomResetBtn || !sidebarZoomDisplay) {
        console.warn('Sidebar缩放控制器元素未找到，跳过初始化');
        return;
    }
    
    // 从localStorage获取保存的缩放倍数
    const savedScale = localStorage.getItem('ppt-zoom-scale');
    window.PPTState.userScaleMultiplier = savedScale ? parseFloat(savedScale) : 1.0;
    updateZoomDisplay();
    
    // Sidebar缩小按钮
    sidebarZoomOutBtn.addEventListener('click', () => {
        window.PPTState.userScaleMultiplier = Math.max(0.2, window.PPTState.userScaleMultiplier - 0.1);
        updateZoomAndSave();
    });
    
    // Sidebar放大按钮
    sidebarZoomInBtn.addEventListener('click', () => {
        window.PPTState.userScaleMultiplier = Math.min(3.0, window.PPTState.userScaleMultiplier + 0.1);
        updateZoomAndSave();
    });
    
    // Sidebar重置按钮
    sidebarZoomResetBtn.addEventListener('click', () => {
        window.PPTState.userScaleMultiplier = 1.0;
        updateZoomAndSave();
    });
    
    // 兼容旧控制器
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            window.PPTState.userScaleMultiplier = Math.max(0.2, window.PPTState.userScaleMultiplier - 0.1);
            updateZoomAndSave();
        });
    }
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            window.PPTState.userScaleMultiplier = Math.min(3.0, window.PPTState.userScaleMultiplier + 0.1);
            updateZoomAndSave();
        });
    }
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => {
            window.PPTState.userScaleMultiplier = 1.0;
            updateZoomAndSave();
        });
    }
    
    function updateZoomAndSave() {
        updateZoomDisplay();
        localStorage.setItem('ppt-zoom-scale', window.PPTState.userScaleMultiplier.toString());
        
        // 重新应用缩放
        const slideViewport = document.querySelector('.slide-viewport');
        if (slideViewport) {
            adjustSlideViewport();
        }
    }
    
    function updateZoomDisplay() {
        const percentage = Math.round(window.PPTState.userScaleMultiplier * 100);
        // 更新sidebar显示
        if (sidebarZoomDisplay) {
            sidebarZoomDisplay.textContent = `${percentage}%`;
        }
        // 兼容旧显示
        if (zoomDisplay) {
            zoomDisplay.textContent = `${percentage}%`;
        }
    }
}

// 全局错误处理
window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason);
});

// 显示Toast消息
function showToast(message, duration = 3000) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // 设置样式
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(4px);
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 动画显示
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动移除
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// 文件夹选择功能
function showFolderSelector() {
    // 先加载PPT画廊
    loadPPTGallery();
    document.getElementById('folder-selector-modal').style.display = 'flex';
}

// 加载PPT画廊
function loadPPTGallery() {
    const galleryGrid = document.getElementById('ppt-gallery-grid');
    if (!galleryGrid) return;
    
    // 清空现有内容
    galleryGrid.innerHTML = '';
    
    // 预定义的PPT项目
    const pptProjects = [
        {
            path: 'ppt/default',
            name: '默认演示',
            description: 'HTML PPT模板介绍',
            badge: '默认',
            badgeClass: 'default',
            previewFile: 'ppt/default/01-welcome.html'
        },
        {
            path: 'ppt/examples/neobrutalism',
            name: '新野兽派',
            description: '大胆色彩、强视觉冲击',
            badge: '创意',
            badgeClass: 'creative',
            previewFile: 'ppt/examples/neobrutalism/01-cover.html'
        },
        {
            path: 'ppt/examples/minimal',
            name: '极简主义',
            description: '简洁优雅、专业商务',
            badge: '商务',
            badgeClass: 'professional',
            previewFile: 'ppt/examples/minimal/01-cover.html'
        }
    ];
    
    // 为每个项目创建卡片
    pptProjects.forEach(project => {
        const card = createPPTCard(project);
        galleryGrid.appendChild(card);
    });
}

// 创建PPT卡片
function createPPTCard(project) {
    const card = document.createElement('div');
    card.className = 'ppt-card';
    card.onclick = () => selectFolder(project.path);
    
    card.innerHTML = `
        <div class="ppt-preview">
            <iframe src="${project.previewFile}" class="preview-frame"></iframe>
        </div>
        <div class="ppt-info">
            <h4>${project.name}</h4>
            <p>${project.description}</p>
            <span class="ppt-badge ${project.badgeClass}">${project.badge}</span>
        </div>
    `;
    
    return card;
}

function closeFolderSelector() {
    document.getElementById('folder-selector-modal').style.display = 'none';
}

function selectFolder(folderPath) {
    // 预定义不同文件夹的文件列表
    const folderFiles = {
        'ppt/default': [
            '01-welcome.html',
            '02-features.html', 
            '03-how-to-use.html'
        ],
        'ppt/examples/neobrutalism': [
            '01-cover.html',
            '02-content.html',
            '03-thanks.html'
        ],
        'ppt/examples/minimal': [
            '01-cover.html',
            '02-content.html',
            '03-thanks.html'
        ]
    };
    
    // 获取文件列表，如果没有预定义则尝试常见文件名
    const files = folderFiles[folderPath] || [
        '01-cover.html',
        '02-content.html',
        '03-thanks.html',
        '01-intro.html',
        '02-main.html',
        '03-conclusion.html'
    ];
    
    // 更新配置
    PPTConfig.slideFiles.basePath = folderPath + '/';
    PPTConfig.slideFiles.files = files;
    
    // 重新加载幻灯片
    loadSlideContent();
    
    // 保存用户选择
    localStorage.setItem('ppt-folder-path', folderPath);
    
    // 关闭弹窗
    closeFolderSelector();
    
    // 不显示任何提示 - 用户可以直接看到幻灯片内容的变化
    // showToast(`已切换到: ${folderPath.replace('ppt/', '').replace('examples/', '')}`);
    
    // 视觉反馈：幻灯片内容会立即变化，无需额外提示
}

function selectCustomFolder() {
    const customPath = document.getElementById('custom-folder-path').value.trim();
    if (!customPath) {
        alert('请输入文件夹路径');
        return;
    }
    
    selectFolder(customPath);
    document.getElementById('custom-folder-path').value = '';
}

// 页面加载时恢复用户选择的文件夹
function restoreUserFolder() {
    const savedFolder = localStorage.getItem('ppt-folder-path');
    if (savedFolder && savedFolder !== 'ppt/default') {
        // 预定义不同文件夹的文件列表
        const folderFiles = {
            'ppt/default': [
                '01-welcome.html',
                '02-features.html', 
                '03-how-to-use.html'
            ],
            'ppt/examples/neobrutalism': [
                '01-cover.html',
                '02-content.html',
                '03-thanks.html'
            ],
            'ppt/examples/minimal': [
                '01-cover.html',
                '02-content.html',
                '03-thanks.html'
            ]
        };
        
        // 获取文件列表
        const files = folderFiles[savedFolder] || [
            '01-cover.html',
            '02-content.html',
            '03-thanks.html'
        ];
        
        // 更新配置
        PPTConfig.slideFiles.basePath = savedFolder + '/';
        PPTConfig.slideFiles.files = files;
    }
}

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
window.showPresentationTimer = showPresentationTimer;
window.resetSlideOrder = resetSlideOrder;
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
window.initializeZoomController = initializeZoomController;
window.showFolderSelector = showFolderSelector;
window.closeFolderSelector = closeFolderSelector;
window.selectFolder = selectFolder;
window.selectCustomFolder = selectCustomFolder;
window.loadPPTGallery = loadPPTGallery;
window.createPPTCard = createPPTCard;
window.showToast = showToast; 