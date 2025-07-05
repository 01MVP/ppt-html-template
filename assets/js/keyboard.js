/**
 * HTML PPT 模板 - 键盘控制模块
 * 
 * 实现完整的键盘导航和快捷键功能
 * 参考 PowerPoint 和 Keynote 的键盘快捷键设计
 */

// 键盘事件管理器
class KeyboardController {
    constructor() {
        this.isEnabled = true;
        this.shortcuts = PPTConfig.keyboard;
        this.init();
    }

    init() {
        this.bindKeyboardEvents();
        this.setupHelpTooltips();
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e), true);
        document.addEventListener('keyup', (e) => this.handleKeyUp(e), true);
        
        // 确保焦点在主文档上，防止iframe捕获键盘事件
        document.addEventListener('click', () => {
            document.body.focus();
        });
        
        // 初始设置焦点
        document.body.tabIndex = -1;
        document.body.focus();
    }

    handleKeyDown(event) {
        // 如果正在输入或快捷键被禁用，则不处理
        if (!this.isEnabled || this.isTyping(event.target)) {
            return;
        }

        const key = event.code;
        const keyName = event.key;
        
        // 阻止默认行为的键
        const preventDefaults = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Space', 'Home', 'End', 'PageUp', 'PageDown',
            'F11', 'KeyH', 'KeyS', 'KeyT', 'KeyB', 'Period'
        ];

        if (preventDefaults.includes(key)) {
            event.preventDefault();
        }

        // 处理快捷键
        this.processShortcut(key, keyName, event);
    }

    handleKeyUp(event) {
        // 可以在这里处理按键释放事件
    }

    processShortcut(key, keyName, event) {
        // 上一张幻灯片
        if (this.shortcuts.prev.includes(key)) {
            prevSlide();
            this.showKeyboardFeedback('上一张');
            return;
        }

        // 下一张幻灯片
        if (this.shortcuts.next.includes(key)) {
            nextSlide();
            this.showKeyboardFeedback('下一张');
            return;
        }

        // 首页
        if (this.shortcuts.home.includes(key)) {
            firstSlide();
            this.showKeyboardFeedback('首页');
            return;
        }

        // 末页
        if (this.shortcuts.end.includes(key)) {
            lastSlide();
            this.showKeyboardFeedback('末页');
            return;
        }

        // 全屏切换
        if (this.shortcuts.fullscreen.includes(key)) {
            toggleFullscreen();
            this.showKeyboardFeedback(PPTState.isFullscreen ? '退出全屏' : '全屏');
            return;
        }

        // 退出全屏
        if (this.shortcuts.exitFullscreen.includes(key)) {
            if (PPTState.isFullscreen) {
                exitFullscreen();
                this.showKeyboardFeedback('退出全屏');
            }
            return;
        }

        // 帮助
        if (this.shortcuts.help.includes(key)) {
            showHelp();
            this.showKeyboardFeedback('帮助');
            return;
        }



        // 功能面板 - 不再支持主题切换
        // 主题切换功能已移除

        // 黑屏/白屏
        if (this.shortcuts.blackout.includes(key)) {
            this.toggleBlackout();
            this.showKeyboardFeedback('黑屏');
            return;
        }

        // 数字键直接跳转
        if (event.code.startsWith('Digit')) {
            const slideNumber = parseInt(keyName) - 1;
            if (slideNumber >= 0 && slideNumber < PPTState.totalSlides) {
                goToSlide(slideNumber);
                this.showKeyboardFeedback(`跳转到第 ${slideNumber + 1} 张`);
            }
            return;
        }

        // Ctrl/Cmd + 组合键
        if (event.ctrlKey || event.metaKey) {
            this.handleCtrlShortcuts(key, event);
            return;
        }
        
        // 功能面板快捷键
        if ((event.ctrlKey || event.metaKey) && keyName === '/') {
            event.preventDefault();
            this.showFunctionPanel();
            this.showKeyboardFeedback('功能面板');
            return;
        }

        // Alt + 组合键
        if (event.altKey) {
            this.handleAltShortcuts(key, event);
            return;
        }

        // Shift + 组合键
        if (event.shiftKey) {
            this.handleShiftShortcuts(key, event);
            return;
        }
    }

    handleCtrlShortcuts(key, event) {
        switch (key) {
            case 'KeyS':
                event.preventDefault();
                this.savePresentation();
                this.showKeyboardFeedback('保存');
                break;
            case 'KeyO':
                event.preventDefault();
                this.openPresentation();
                this.showKeyboardFeedback('打开');
                break;
            case 'KeyP':
                event.preventDefault();
                exportToPDF();
                this.showKeyboardFeedback('打印');
                break;
            case 'KeyN':
                event.preventDefault();
                this.newPresentation();
                this.showKeyboardFeedback('新建');
                break;
            case 'KeyF':
                event.preventDefault();
                this.toggleSearch();
                this.showKeyboardFeedback('搜索');
                break;
            case 'KeyZ':
                event.preventDefault();
                this.undo();
                this.showKeyboardFeedback('撤销');
                break;
            case 'KeyY':
                event.preventDefault();
                this.redo();
                this.showKeyboardFeedback('重做');
                break;
        }
    }

    handleAltShortcuts(key, event) {
        switch (key) {
            case 'KeyT':
                event.preventDefault();
                this.showPresentationTimer();
                this.showKeyboardFeedback('演示计时器');
                break;
            case 'KeyO':
                event.preventDefault();
                toggleSidebar();
                this.showKeyboardFeedback('切换侧边栏');
                break;
            case 'KeyL':
                event.preventDefault();
                this.showLayoutTemplates();
                this.showKeyboardFeedback('布局模板');
                break;
            case 'KeyM':
                event.preventDefault();
                toggleSidebar();
                this.showKeyboardFeedback('切换菜单');
                break;
            case 'Tab':
                event.preventDefault();
                toggleSidebar();
                this.showKeyboardFeedback('切换侧边栏');
                break;
            case 'KeyU':
                event.preventDefault();
                toggleSidebar();
                this.showKeyboardFeedback('切换侧边栏');
                break;
            case 'KeyI':
                event.preventDefault();
                if (typeof showPresentationTimer === 'function') {
                    showPresentationTimer();
                    this.showKeyboardFeedback('演示计时器');
                }
                break;
        }
    }

    handleShiftShortcuts(key, event) {
        switch (key) {
            case 'F11':
                event.preventDefault();
                this.togglePresentationMode();
                this.showKeyboardFeedback('演示模式');
                break;
        }
    }

    // 检查是否正在输入
    isTyping(target) {
        const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
        return inputTypes.includes(target.tagName) || 
               target.contentEditable === 'true' ||
               target.isContentEditable;
    }

    // 显示键盘操作反馈
    showKeyboardFeedback(message) {
        // 创建或更新反馈提示
        let feedback = document.getElementById('keyboard-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'keyboard-feedback';
            feedback.className = 'keyboard-feedback';
            document.body.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.classList.add('show');

        // 自动隐藏
        clearTimeout(this.feedbackTimeout);
        this.feedbackTimeout = setTimeout(() => {
            feedback.classList.remove('show');
        }, 1500);
    }

    // 演讲者模式切换
    toggleSpeakerMode() {
        PPTState.isPresenting = !PPTState.isPresenting;
        
        if (PPTState.isPresenting) {
            this.enterSpeakerMode();
        } else {
            this.exitSpeakerMode();
        }
    }

    enterSpeakerMode() {
        // 进入演讲者模式
        document.body.classList.add('speaker-mode');
        
        // 隐藏不必要的界面元素
        const elementsToHide = [
            '.sidebar',
            '.control-bar',
            '.welcome-overlay'
        ];
        
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });

        // 显示演讲者信息
        this.showSpeakerNotes();
    }

    exitSpeakerMode() {
        // 退出演讲者模式
        document.body.classList.remove('speaker-mode');
        
        // 恢复界面元素
        const elementsToShow = [
            '.sidebar',
            '.control-bar'
        ];
        
        elementsToShow.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = '';
            });
        });

        // 隐藏演讲者信息
        this.hideSpeakerNotes();
    }



    // 黑屏/白屏功能
    toggleBlackout() {
        PPTState.isBlackout = !PPTState.isBlackout;
        
        let blackoutOverlay = document.getElementById('blackout-overlay');
        if (!blackoutOverlay) {
            blackoutOverlay = document.createElement('div');
            blackoutOverlay.id = 'blackout-overlay';
            blackoutOverlay.className = 'blackout-overlay';
            blackoutOverlay.innerHTML = `
                <div class="blackout-message">
                    <p>按 B 键或 . 键恢复演示</p>
                </div>
            `;
            document.body.appendChild(blackoutOverlay);
        }

        if (PPTState.isBlackout) {
            blackoutOverlay.style.display = 'flex';
        } else {
            blackoutOverlay.style.display = 'none';
        }
    }

    // 搜索功能
    toggleSearch() {
        let searchBox = document.getElementById('search-box');
        if (!searchBox) {
            searchBox = document.createElement('div');
            searchBox.id = 'search-box';
            searchBox.className = 'search-box';
            searchBox.innerHTML = `
                <input type="text" placeholder="搜索幻灯片..." id="search-input">
                <button onclick="keyboardController.hideSearch()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.body.appendChild(searchBox);
            
            // 绑定搜索事件
            const searchInput = searchBox.querySelector('#search-input');
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
            
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.selectFirstResult();
                } else if (e.key === 'Escape') {
                    this.hideSearch();
                }
            });
        }

        if (searchBox.style.display === 'block') {
            this.hideSearch();
        } else {
            searchBox.style.display = 'block';
            searchBox.querySelector('#search-input').focus();
        }
    }

    hideSearch() {
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            searchBox.style.display = 'none';
        }
    }

    performSearch(query) {
        // 实现搜索逻辑
        if (!query) return;
        
        // 这里可以添加搜索逻辑
        console.log('Searching for:', query);
    }

    // 保存演示文稿
    savePresentation() {
        const data = {
            config: PPTConfig,
            state: PPTState,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 打开演示文稿
    openPresentation() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.loadPresentation(data);
                    } catch (error) {
                        alert('文件格式错误');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    loadPresentation(data) {
        // 加载演示文稿数据
        if (data.config) {
            Object.assign(PPTConfig, data.config);
        }
        if (data.state) {
            Object.assign(PPTState, data.state);
        }
        
        // 重新初始化
        initializePPT();
        this.showKeyboardFeedback('演示文稿已加载');
    }

    // 新建演示文稿
    newPresentation() {
        if (confirm('确定要新建演示文稿吗？当前内容将丢失。')) {
            location.reload();
        }
    }

    // 撤销操作
    undo() {
        // 实现撤销逻辑
        console.log('Undo operation');
    }

    // 重做操作
    redo() {
        // 实现重做逻辑
        console.log('Redo operation');
    }

    // 切换演示模式
    togglePresentationMode() {
        if (PPTState.isPresenting) {
            this.exitSpeakerMode();
        } else {
            this.enterSpeakerMode();
        }
    }

    // 启用/禁用键盘控制
    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    // 添加自定义快捷键
    addShortcut(key, callback) {
        if (!this.customShortcuts) {
            this.customShortcuts = {};
        }
        this.customShortcuts[key] = callback;
    }

    // 移除自定义快捷键
    removeShortcut(key) {
        if (this.customShortcuts) {
            delete this.customShortcuts[key];
        }
    }

    // 设置帮助提示
    setupHelpTooltips() {
        // 可以在这里设置键盘快捷键的提示
        const controlButtons = document.querySelectorAll('.control-btn');
        controlButtons.forEach(btn => {
            const title = btn.getAttribute('title');
            if (title) {
                btn.setAttribute('data-tooltip', title);
            }
        });
    }

    // 获取当前快捷键映射
    getShortcuts() {
        return this.shortcuts;
    }

    // 更新快捷键映射
    updateShortcuts(newShortcuts) {
        this.shortcuts = { ...this.shortcuts, ...newShortcuts };
    }
    
    // 新增功能方法
    showFunctionPanel() {
        if (window.functionPanel) {
            window.functionPanel.show();
        } else if (window.showFunctionPanel) {
            window.showFunctionPanel();
        }
    }
    
    showPresentationTimer() {
        if (window.showPresentationTimer) {
            window.showPresentationTimer();
        }
    }
    
    showSlideThumbnails() {
        if (window.showSlideThumbnails) {
            window.showSlideThumbnails();
        }
    }
    
    showLayoutTemplates() {
        if (window.showLayoutTemplates) {
            window.showLayoutTemplates();
        }
    }
}

// 添加键盘反馈样式
const keyboardFeedbackStyle = `
    .keyboard-feedback {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        pointer-events: none;
    }
    
    .keyboard-feedback.show {
        opacity: 1;
        transform: translateY(0);
    }
    

    
    .blackout-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .blackout-message {
        color: white;
        text-align: center;
        font-size: 18px;
        opacity: 0.7;
    }
    
    .search-box {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--card-background);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;
        box-shadow: var(--shadow-lg);
        display: none;
        z-index: 1000;
        min-width: 300px;
    }
    
    .search-box input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 8px;
    }
    
    .search-box button {
        float: right;
        padding: 4px 8px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        cursor: pointer;
    }
    
    @media (max-width: 768px) {
        .keyboard-feedback {
            top: 10px;
            right: 10px;
            font-size: 12px;
            padding: 6px 12px;
        }
        

        
        .search-box {
            left: 10px;
            right: 10px;
            transform: none;
            min-width: auto;
        }
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = keyboardFeedbackStyle;
document.head.appendChild(styleSheet);

// 创建键盘控制器实例
const keyboardController = new KeyboardController();

// 导出到全局作用域
window.keyboardController = keyboardController; 