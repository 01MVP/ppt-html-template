/**
 * HTML PPT 模板 - 统一功能面板
 * 
 * 集中管理所有功能、快捷键和使用教程
 * 提供统一的功能入口和帮助系统
 */

class FunctionPanel {
    constructor() {
        this.isVisible = false;
        this.currentTab = 'functions';
        
        this.functions = {
            presentation: {
                name: '演示功能',
                icon: 'fas fa-play',
                items: [
                    {
                        id: 'presentation-timer',
                        name: '演示计时器',
                        icon: 'fas fa-clock',
                        description: '专业的演示时间管理工具',
                        shortcut: 'Alt + T',
                        action: () => this.showPresentationTimer()
                    },
                    {
                        id: 'speaker-mode',
                        name: '演讲者模式',
                        icon: 'fas fa-microphone',
                        description: '显示备注和下一张幻灯片预览',
                        shortcut: 'S',
                        action: () => this.toggleSpeakerMode()
                    },
                    {
                        id: 'fullscreen',
                        name: '全屏演示',
                        icon: 'fas fa-expand',
                        description: '进入全屏演示模式',
                        shortcut: 'F11',
                        action: () => this.toggleFullscreen()
                    },
                    {
                        id: 'blackout',
                        name: '黑屏模式',
                        icon: 'fas fa-moon',
                        description: '暂时黑屏，吸引观众注意',
                        shortcut: 'B / .',
                        action: () => this.toggleBlackout()
                    }
                ]
            },
            editing: {
                name: '编辑功能',
                icon: 'fas fa-edit',
                items: [
                    {
                        id: 'slide-thumbnails',
                        name: '幻灯片概览',
                        icon: 'fas fa-th-large',
                        description: '查看所有幻灯片缩略图，支持拖拽排序',
                        shortcut: 'Alt + O',
                        action: () => this.showSlideThumbnails()
                    },
                    {
                        id: 'layout-templates',
                        name: '布局模板',
                        icon: 'fas fa-th',
                        description: '选择和应用专业的幻灯片布局',
                        shortcut: 'Alt + L',
                        action: () => this.showLayoutTemplates()
                    },
                    {
                        id: 'code-highlight',
                        name: '代码高亮',
                        icon: 'fas fa-code',
                        description: '自动高亮代码块，支持多种语言',
                        shortcut: '自动检测',
                        action: () => this.showCodeHighlightInfo()
                    }
                ]
            },
            navigation: {
                name: '导航功能',
                icon: 'fas fa-map',
                items: [
                    {
                        id: 'slide-search',
                        name: '幻灯片搜索',
                        icon: 'fas fa-search',
                        description: '快速搜索和定位幻灯片内容',
                        shortcut: 'Ctrl/Cmd + F',
                        action: () => this.toggleSearch()
                    },
                    {
                        id: 'goto-slide',
                        name: '跳转到指定幻灯片',
                        icon: 'fas fa-arrow-right',
                        description: '直接跳转到指定编号的幻灯片',
                        shortcut: '数字键 1-9',
                        action: () => this.showGotoSlideDialog()
                    }
                ]
            },
            file: {
                name: '文件操作',
                icon: 'fas fa-file',
                items: [
                    {
                        id: 'save-presentation',
                        name: '保存演示文稿',
                        icon: 'fas fa-save',
                        description: '保存当前演示文稿到本地',
                        shortcut: 'Ctrl/Cmd + S',
                        action: () => this.savePresentation()
                    },
                    {
                        id: 'export-pdf',
                        name: '导出 PDF',
                        icon: 'fas fa-file-pdf',
                        description: '将演示文稿导出为 PDF 文件',
                        shortcut: 'Ctrl/Cmd + P',
                        action: () => this.exportToPDF()
                    },
                    {
                        id: 'load-presentation',
                        name: '加载演示文稿',
                        icon: 'fas fa-folder-open',
                        description: '从本地加载之前保存的演示文稿',
                        shortcut: 'Ctrl/Cmd + O',
                        action: () => this.loadPresentation()
                    }
                ]
            }
        };
        
        this.tutorials = [
            {
                title: '基本导航',
                content: `
                    <h4>幻灯片切换</h4>
                    <ul>
                        <li>使用 <kbd>←</kbd> <kbd>→</kbd> 方向键切换幻灯片</li>
                        <li>按 <kbd>Space</kbd> 进入下一张幻灯片</li>
                        <li>按 <kbd>Home</kbd> 回到首页，<kbd>End</kbd> 跳转到末页</li>
                        <li>按数字键 <kbd>1-9</kbd> 直接跳转到指定幻灯片</li>
                    </ul>
                `
            },
            {
                title: '演示模式',
                content: `
                    <h4>专业演示功能</h4>
                    <ul>
                        <li>按 <kbd>F11</kbd> 进入全屏模式</li>
                        <li>按 <kbd>S</kbd> 开启演讲者模式，查看备注</li>
                        <li>按 <kbd>B</kbd> 或 <kbd>.</kbd> 进入黑屏模式</li>
                        <li>使用 <kbd>Alt + T</kbd> 打开演示计时器</li>
                    </ul>
                `
            },
            {
                title: '编辑功能',
                content: `
                    <h4>内容编辑和管理</h4>
                    <ul>
                        <li>按 <kbd>Alt + O</kbd> 打开幻灯片概览</li>
                        <li>按 <kbd>Alt + L</kbd> 选择布局模板</li>
                        <li>在概览模式下可以拖拽排序幻灯片</li>
                        <li>代码块会自动语法高亮</li>
                    </ul>
                `
            },
            {
                title: '高级技巧',
                content: `
                    <h4>提高效率的技巧</h4>
                    <ul>
                        <li>使用 <kbd>Ctrl/Cmd + S</kbd> 随时保存工作</li>
                        <li>使用 <kbd>Ctrl/Cmd + F</kbd> 搜索幻灯片内容</li>
                        <li>在演示计时器中设置目标时间</li>
                        <li>在布局模板中预览效果再应用</li>
                    </ul>
                `
            }
        ];
        
        this.init();
    }

    init() {
        this.createFunctionPanel();
        this.bindEvents();
        this.setupGlobalShortcuts();
    }

    createFunctionPanel() {
        const panel = document.createElement('div');
        panel.id = 'function-panel';
        panel.className = 'function-panel';
        panel.innerHTML = `
            <div class="function-panel-overlay"></div>
            <div class="function-panel-content">
                <div class="function-panel-header">
                    <h2>
                        <i class="fas fa-cogs"></i>
                        功能中心
                    </h2>
                    <button class="function-panel-close" id="function-panel-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="function-panel-tabs">
                    <button class="tab-btn active" data-tab="functions">
                        <i class="fas fa-rocket"></i>
                        功能列表
                    </button>
                    <button class="tab-btn" data-tab="shortcuts">
                        <i class="fas fa-keyboard"></i>
                        快捷键
                    </button>
                    <button class="tab-btn" data-tab="tutorials">
                        <i class="fas fa-graduation-cap"></i>
                        使用教程
                    </button>
                    <button class="tab-btn" data-tab="about">
                        <i class="fas fa-info-circle"></i>
                        关于
                    </button>
                </div>
                
                <div class="function-panel-body">
                    <div class="tab-content active" id="tab-functions">
                        ${this.generateFunctionsContent()}
                    </div>
                    
                    <div class="tab-content" id="tab-shortcuts">
                        ${this.generateShortcutsContent()}
                    </div>
                    
                    <div class="tab-content" id="tab-tutorials">
                        ${this.generateTutorialsContent()}
                    </div>
                    
                    <div class="tab-content" id="tab-about">
                        ${this.generateAboutContent()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }

    generateFunctionsContent() {
        let content = '<div class="functions-grid">';
        
        Object.entries(this.functions).forEach(([categoryKey, category]) => {
            content += `
                <div class="function-category">
                    <h3 class="category-title">
                        <i class="${category.icon}"></i>
                        ${category.name}
                    </h3>
                    <div class="function-items">
            `;
            
            category.items.forEach(item => {
                content += `
                    <div class="function-item" data-function="${item.id}">
                        <div class="function-icon">
                            <i class="${item.icon}"></i>
                        </div>
                        <div class="function-info">
                            <h4>${item.name}</h4>
                            <p>${item.description}</p>
                            <span class="function-shortcut">${item.shortcut}</span>
                        </div>
                        <button class="function-trigger" data-action="${item.id}">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                `;
            });
            
            content += `
                    </div>
                </div>
            `;
        });
        
        content += '</div>';
        return content;
    }

    generateShortcutsContent() {
        let content = '<div class="shortcuts-content">';
        
        const shortcutCategories = {
            '基本导航': [
                { keys: '← →', desc: '切换幻灯片' },
                { keys: '↑ ↓', desc: '切换幻灯片（可选）' },
                { keys: 'Space', desc: '下一张幻灯片' },
                { keys: 'Home', desc: '第一张幻灯片' },
                { keys: 'End', desc: '最后一张幻灯片' },
                { keys: '1-9', desc: '跳转到指定幻灯片' }
            ],
            '演示控制': [
                { keys: 'F11', desc: '全屏/退出全屏' },
                { keys: 'Esc', desc: '退出全屏' },
                { keys: 'S', desc: '演讲者模式' },
                { keys: 'B / .', desc: '黑屏模式' },
                { keys: 'Alt + T', desc: '演示计时器' }
            ],
            '编辑功能': [
                { keys: 'Alt + O', desc: '幻灯片概览' },
                { keys: 'Alt + L', desc: '布局模板' },
                { keys: 'Ctrl/Cmd + F', desc: '搜索幻灯片' }
            ],
            '文件操作': [
                { keys: 'Ctrl/Cmd + S', desc: '保存演示文稿' },
                { keys: 'Ctrl/Cmd + O', desc: '打开演示文稿' },
                { keys: 'Ctrl/Cmd + P', desc: '导出PDF' },
                { keys: 'Ctrl/Cmd + N', desc: '新建演示文稿' }
            ]
        };
        
        Object.entries(shortcutCategories).forEach(([category, shortcuts]) => {
            content += `
                <div class="shortcut-category">
                    <h3>${category}</h3>
                    <div class="shortcut-list">
            `;
            
            shortcuts.forEach(shortcut => {
                content += `
                    <div class="shortcut-item">
                        <div class="shortcut-keys">
                            ${shortcut.keys.split(' ').map(key => `<kbd>${key}</kbd>`).join(' ')}
                        </div>
                        <div class="shortcut-desc">${shortcut.desc}</div>
                    </div>
                `;
            });
            
            content += `
                    </div>
                </div>
            `;
        });
        
        content += '</div>';
        return content;
    }

    generateTutorialsContent() {
        let content = '<div class="tutorials-content">';
        
        this.tutorials.forEach((tutorial, index) => {
            content += `
                <div class="tutorial-section">
                    <h3>
                        <span class="tutorial-number">${index + 1}</span>
                        ${tutorial.title}
                    </h3>
                    <div class="tutorial-content">
                        ${tutorial.content}
                    </div>
                </div>
            `;
        });
        
        // 添加代码示例
        content += `
            <div class="tutorial-section">
                <h3>
                    <span class="tutorial-number">💡</span>
                    代码高亮示例
                </h3>
                <div class="tutorial-content">
                    <p>在幻灯片中添加代码块会自动高亮：</p>
                    <pre><code class="language-javascript">
// JavaScript 示例
function createSlide(title, content) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = \`
        &lt;h2&gt;\${title}&lt;/h2&gt;
        &lt;div class="content"&gt;\${content}&lt;/div&gt;
    \`;
    return slide;
}
                    </code></pre>
                </div>
            </div>
        `;
        
        content += '</div>';
        return content;
    }

    generateAboutContent() {
        return `
            <div class="about-content">
                <div class="about-section">
                    <h3>关于 HTML PPT 模板</h3>
                    <p>这是一个功能强大的纯HTML演示文稿模板，无需安装任何软件即可使用。</p>
                    
                    <h4>主要特性</h4>
                    <ul>
                        <li>✨ 零依赖，下载即用</li>
                        <li>📱 完全响应式设计</li>
                        <li>⌨️ 丰富的键盘快捷键</li>
                        <li>🎨 专业的演示功能</li>
                        <li>🔧 强大的编辑工具</li>
                        <li>📊 演示数据统计</li>
                        <li>💾 保存/加载功能</li>
                    </ul>
                </div>
                
                <div class="about-section">
                    <h4>技术规格</h4>
                    <ul>
                        <li><strong>支持的浏览器：</strong>Chrome 60+, Firefox 55+, Safari 11+, Edge 79+</li>
                        <li><strong>文件大小：</strong>&lt; 5MB (含所有功能)</li>
                        <li><strong>依赖项：</strong>无 (纯HTML/CSS/JavaScript)</li>
                        <li><strong>许可证：</strong>MIT License</li>
                    </ul>
                </div>
                
                <div class="about-section">
                    <h4>版本信息</h4>
                    <p><strong>当前版本：</strong>2.0.0</p>
                    <p><strong>更新日期：</strong>${new Date().toLocaleDateString()}</p>
                    
                    <h5>v2.0.0 新增功能</h5>
                    <ul>
                        <li>统一功能面板</li>
                        <li>演示计时器</li>
                        <li>幻灯片缩略图</li>
                        <li>代码语法高亮</li>
                        <li>布局模板系统</li>
                        <li>拖拽排序功能</li>
                    </ul>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // 关闭按钮
        document.getElementById('function-panel-close').addEventListener('click', () => this.hide());
        
        // 遮罩层点击关闭
        document.querySelector('.function-panel-overlay').addEventListener('click', () => this.hide());
        
        // 标签切换
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // 功能触发按钮
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.function-trigger');
            if (trigger) {
                const action = trigger.dataset.action;
                this.triggerFunction(action);
            }
        });
    }

    setupGlobalShortcuts() {
        // 修复快捷键冲突
        document.addEventListener('keydown', (e) => {
            // 功能面板快捷键 - 改为 Ctrl/Cmd + ?
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.toggle();
                return;
            }
            
            // Alt + 组合键（避免与系统快捷键冲突）
            if (e.altKey && !e.ctrlKey && !e.metaKey) {
                switch (e.code) {
                    case 'KeyO':
                        e.preventDefault();
                        this.showSlideThumbnails();
                        break;
                    case 'KeyL':
                        e.preventDefault();
                        this.showLayoutTemplates();
                        break;
                    case 'KeyT':
                        e.preventDefault();
                        this.showPresentationTimer();
                        break;
                }
            }
        });
    }

    switchTab(tabName) {
        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 更新内容显示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');
        
        this.currentTab = tabName;
    }

    triggerFunction(functionId) {
        // 查找并执行对应的功能
        for (const category of Object.values(this.functions)) {
            const item = category.items.find(item => item.id === functionId);
            if (item && item.action) {
                item.action();
                // 如果是主要功能，关闭面板
                if (['presentation-timer', 'slide-thumbnails', 'layout-templates'].includes(functionId)) {
                    this.hide();
                }
                break;
            }
        }
    }

    // 功能方法
    showPresentationTimer() {
        if (typeof showPresentationTimer === 'function') {
            showPresentationTimer();
        }
    }

    showSlideThumbnails() {
        if (typeof showSlideThumbnails === 'function') {
            showSlideThumbnails();
        }
    }

    showLayoutTemplates() {
        if (typeof showLayoutTemplates === 'function') {
            showLayoutTemplates();
        }
    }

    toggleSpeakerMode() {
        if (window.keyboardController && window.keyboardController.toggleSpeakerMode) {
            window.keyboardController.toggleSpeakerMode();
        }
    }

    toggleFullscreen() {
        if (typeof toggleFullscreen === 'function') {
            toggleFullscreen();
        }
    }

    toggleBlackout() {
        if (window.keyboardController && window.keyboardController.toggleBlackout) {
            window.keyboardController.toggleBlackout();
        }
    }

    toggleSearch() {
        if (window.keyboardController && window.keyboardController.toggleSearch) {
            window.keyboardController.toggleSearch();
        }
    }

    savePresentation() {
        if (window.keyboardController && window.keyboardController.savePresentation) {
            window.keyboardController.savePresentation();
        }
    }

    loadPresentation() {
        if (window.keyboardController && window.keyboardController.openPresentation) {
            window.keyboardController.openPresentation();
        }
    }

    exportToPDF() {
        if (typeof exportToPDF === 'function') {
            exportToPDF();
        }
    }

    showCodeHighlightInfo() {
        alert('代码高亮功能会自动检测页面中的代码块并进行语法高亮。\n\n支持的语言：JavaScript, Python, HTML, CSS\n\n使用方法：将代码放在 <pre><code> 标签中即可。');
    }

    showGotoSlideDialog() {
        const slideNumber = prompt('请输入要跳转的幻灯片编号 (1-' + (PPTState?.totalSlides || 6) + ')：');
        if (slideNumber && !isNaN(slideNumber)) {
            const index = parseInt(slideNumber) - 1;
            if (index >= 0 && index < (PPTState?.totalSlides || 6)) {
                if (typeof goToSlide === 'function') {
                    goToSlide(index);
                }
            } else {
                alert('幻灯片编号超出范围！');
            }
        }
    }

    show() {
        document.getElementById('function-panel').style.display = 'flex';
        this.isVisible = true;
        
        // 焦点管理
        setTimeout(() => {
            document.querySelector('.function-panel-content').focus();
        }, 100);
    }

    hide() {
        document.getElementById('function-panel').style.display = 'none';
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// 功能面板样式
const functionPanelStyles = `
    /* 功能面板样式 */
    .function-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        display: none;
        align-items: center;
        justify-content: center;
    }

    .function-panel-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    .function-panel-content {
        position: relative;
        width: 90%;
        max-width: 1000px;
        height: 80%;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        outline: none;
    }

    .function-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .function-panel-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .function-panel-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .function-panel-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
    }

    .function-panel-tabs {
        display: flex;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
    }

    .tab-btn {
        flex: 1;
        padding: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        color: #64748b;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .tab-btn:hover {
        background: #e2e8f0;
        color: #475569;
    }

    .tab-btn.active {
        background: white;
        color: #1e293b;
        box-shadow: inset 0 -2px 0 #667eea;
    }

    .function-panel-body {
        flex: 1;
        overflow-y: auto;
        padding: 0;
    }

    .tab-content {
        display: none;
        padding: 2rem;
        height: 100%;
    }

    .tab-content.active {
        display: block;
    }

    /* 功能列表样式 */
    .functions-grid {
        display: grid;
        gap: 2rem;
    }

    .function-category {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
    }

    .category-title {
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .function-items {
        display: grid;
        gap: 1rem;
    }

    .function-item {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.2s ease;
    }

    .function-item:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    .function-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
    }

    .function-info {
        flex: 1;
    }

    .function-info h4 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
    }

    .function-info p {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        color: #64748b;
        line-height: 1.4;
    }

    .function-shortcut {
        font-size: 0.8rem;
        color: #94a3b8;
        font-weight: 500;
        background: #f1f5f9;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }

    .function-trigger {
        width: 40px;
        height: 40px;
        background: #667eea;
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .function-trigger:hover {
        background: #5a67d8;
        transform: scale(1.1);
    }

    /* 快捷键样式 */
    .shortcuts-content {
        display: grid;
        gap: 2rem;
    }

    .shortcut-category {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
    }

    .shortcut-category h3 {
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: #1e293b;
    }

    .shortcut-list {
        display: grid;
        gap: 0.75rem;
    }

    .shortcut-item {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .shortcut-keys {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .shortcut-keys kbd {
        background: #1e293b;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
        border: 1px solid #374151;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .shortcut-desc {
        color: #64748b;
        font-size: 0.9rem;
    }

    /* 教程样式 */
    .tutorials-content {
        display: grid;
        gap: 2rem;
    }

    .tutorial-section {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
    }

    .tutorial-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .tutorial-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #667eea;
        color: white;
        border-radius: 50%;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .tutorial-content {
        color: #475569;
        line-height: 1.6;
    }

    .tutorial-content h4 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
    }

    .tutorial-content ul {
        margin: 0;
        padding-left: 1.5rem;
    }

    .tutorial-content li {
        margin-bottom: 0.5rem;
    }

    .tutorial-content kbd {
        background: #1e293b;
        color: white;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .tutorial-content pre {
        background: #1e293b;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
        font-size: 0.9rem;
        margin: 1rem 0;
    }

    /* 关于页面样式 */
    .about-content {
        display: grid;
        gap: 2rem;
    }

    .about-section {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
    }

    .about-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
        font-weight: 600;
        color: #1e293b;
    }

    .about-section h4 {
        margin: 1.5rem 0 0.75rem 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #374151;
    }

    .about-section h5 {
        margin: 1rem 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #4b5563;
    }

    .about-section p {
        margin: 0 0 1rem 0;
        color: #64748b;
        line-height: 1.6;
    }

    .about-section ul {
        margin: 0;
        padding-left: 1.5rem;
        color: #64748b;
    }

    .about-section li {
        margin-bottom: 0.5rem;
        line-height: 1.5;
    }

    /* 响应式调整 */
    @media (max-width: 768px) {
        .function-panel-content {
            width: 95%;
            height: 90%;
        }
        
        .function-panel-header {
            padding: 1rem;
        }
        
        .function-panel-header h2 {
            font-size: 1.2rem;
        }
        
        .tab-btn {
            padding: 0.75rem 0.5rem;
            font-size: 0.8rem;
        }
        
        .tab-content {
            padding: 1rem;
        }
        
        .function-item {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
        }
        
        .function-info {
            order: -1;
        }
        
        .shortcut-item {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }
    }
`;

// 添加样式到页面
function addFunctionPanelStyles() {
    if (!document.getElementById('function-panel-styles')) {
        const style = document.createElement('style');
        style.id = 'function-panel-styles';
        style.textContent = functionPanelStyles;
        document.head.appendChild(style);
    }
}

// 初始化功能面板
function initializeFunctionPanel() {
    addFunctionPanelStyles();
    const panel = new FunctionPanel();
    window.functionPanel = panel;
    return panel;
}

// 显示功能面板的全局函数
function showFunctionPanel() {
    if (window.functionPanel) {
        window.functionPanel.show();
    } else {
        initializeFunctionPanel();
        window.functionPanel.show();
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFunctionPanel);
} else {
    initializeFunctionPanel();
}

// 导出到全局
window.FunctionPanel = FunctionPanel;
window.initializeFunctionPanel = initializeFunctionPanel;
window.showFunctionPanel = showFunctionPanel; 