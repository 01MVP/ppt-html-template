/**
 * HTML PPT 模板 - 幻灯片缩略图预览模块
 * 
 * 提供幻灯片缩略图预览功能，包括：
 * - 幻灯片概览
 * - 快速导航
 * - 拖拽排序
 * - 批量操作
 */

class SlideThumbnails {
    constructor() {
        this.thumbnails = [];
        this.currentSlide = 0;
        this.isVisible = false;
        this.isDragging = false;
        this.draggedIndex = null;
        this.scale = 0.25; // 缩略图缩放比例
        
        this.init();
    }

    init() {
        this.createThumbnailPanel();
        this.bindEvents();
        this.generateThumbnails();
    }

    createThumbnailPanel() {
        const panel = document.createElement('div');
        panel.id = 'slide-thumbnails-panel';
        panel.className = 'slide-thumbnails-panel';
        panel.innerHTML = `
            <div class="thumbnails-header">
                <h3>
                    <i class="fas fa-th-large"></i>
                    幻灯片概览
                </h3>
                <div class="thumbnails-controls">
                    <button class="thumb-btn" id="thumb-add" title="添加幻灯片">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="thumb-btn" id="thumb-duplicate" title="复制幻灯片">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="thumb-btn" id="thumb-delete" title="删除幻灯片">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="thumb-btn" id="thumb-settings" title="设置">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="thumb-btn" id="thumb-close" title="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="thumbnails-content">
                <div class="thumbnails-grid" id="thumbnails-grid">
                    <!-- 缩略图将在这里生成 -->
                </div>
            </div>
            
            <div class="thumbnails-footer">
                <div class="thumbnail-info">
                    <span id="slide-count">0 张幻灯片</span>
                    <span id="current-position">当前: 1/1</span>
                </div>
                <div class="thumbnail-actions">
                    <button class="thumb-action-btn" id="thumb-export">
                        <i class="fas fa-download"></i>
                        导出
                    </button>
                    <button class="thumb-action-btn" id="thumb-fullscreen">
                        <i class="fas fa-expand"></i>
                        全屏
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 创建设置面板
        this.createSettingsPanel();
    }

    createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'thumbnails-settings-panel';
        settingsPanel.className = 'thumbnails-settings-panel';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <h4>缩略图设置</h4>
                <button class="settings-close" id="thumb-settings-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="settings-content">
                <div class="setting-item">
                    <label>缩略图大小:</label>
                    <input type="range" id="thumb-scale" min="0.2" max="0.5" step="0.05" value="0.25">
                    <span id="thumb-scale-value">25%</span>
                </div>
                
                <div class="setting-item">
                    <label>每行显示数量:</label>
                    <input type="number" id="thumb-columns" min="2" max="8" value="4">
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="thumb-show-titles" checked>
                        显示幻灯片标题
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="thumb-show-numbers" checked>
                        显示幻灯片编号
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="thumb-auto-update" checked>
                        自动更新缩略图
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="thumb-drag-reorder" checked>
                        拖拽排序
                    </label>
                </div>
            </div>
            
            <div class="settings-actions">
                <button class="settings-btn save" id="thumb-settings-save">保存设置</button>
                <button class="settings-btn cancel" id="thumb-settings-cancel">取消</button>
            </div>
        `;
        
        document.body.appendChild(settingsPanel);
    }

    bindEvents() {
        // 控制按钮
        document.getElementById('thumb-add').addEventListener('click', () => this.addSlide());
        document.getElementById('thumb-duplicate').addEventListener('click', () => this.duplicateSlide());
        document.getElementById('thumb-delete').addEventListener('click', () => this.deleteSlide());
        document.getElementById('thumb-settings').addEventListener('click', () => this.showSettings());
        document.getElementById('thumb-close').addEventListener('click', () => this.hide());
        
        // 底部按钮
        document.getElementById('thumb-export').addEventListener('click', () => this.exportThumbnails());
        document.getElementById('thumb-fullscreen').addEventListener('click', () => this.toggleFullscreen());
        
        // 设置面板
        document.getElementById('thumb-settings-close').addEventListener('click', () => this.hideSettings());
        document.getElementById('thumb-settings-save').addEventListener('click', () => this.saveSettings());
        document.getElementById('thumb-settings-cancel').addEventListener('click', () => this.hideSettings());
        
        // 设置控件
        document.getElementById('thumb-scale').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('thumb-scale-value').textContent = `${Math.round(value * 100)}%`;
        });
        
        // 监听幻灯片变化
        document.addEventListener('slideChanged', (e) => {
            this.currentSlide = e.detail.currentSlide;
            this.updateCurrentIndicator();
        });
        
        // 监听内容变化
        document.addEventListener('slideContentChanged', () => {
            if (this.autoUpdate) {
                this.updateThumbnails();
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'o' && e.altKey) {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    generateThumbnails() {
        const grid = document.getElementById('thumbnails-grid');
        grid.innerHTML = '';
        
        this.thumbnails = [];
        
        // 在iframe架构中，从PPTState获取幻灯片信息
        if (window.PPTState && window.PPTState.slides) {
            window.PPTState.slides.forEach((slideData, index) => {
                this.createThumbnailFromIframe(slideData, index);
            });
        }
        
        this.updateInfo();
    }

    createThumbnailFromIframe(slideData, index) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'slide-thumbnail';
        thumbnail.dataset.index = index;
        
        thumbnail.innerHTML = `
            <div class="thumbnail-wrapper">
                <div class="thumbnail-content">
                    <iframe 
                        src="${slideData.filepath}" 
                        frameborder="0"
                        style="width: ${100 / this.scale}%; height: ${100 / this.scale}%; border: none; pointer-events: none; transform: scale(${this.scale}); transform-origin: top left; background: white;"
                    ></iframe>
                </div>
                <div class="thumbnail-overlay">
                    <div class="thumbnail-number">${index + 1}</div>
                    <div class="thumbnail-actions">
                        <button class="thumb-action" data-action="goto" title="跳转">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="thumb-action" data-action="edit" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="thumb-action" data-action="duplicate" title="复制">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="thumb-action" data-action="delete" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="thumbnail-title">${slideData.title}</div>
        `;
        
        // 绑定事件
        this.bindThumbnailEvents(thumbnail, index);
        
        // 添加到缩略图数组
        this.thumbnails.push(thumbnail);
        
        // 添加到网格
        const grid = document.getElementById('thumbnails-grid');
        grid.appendChild(thumbnail);
        
        return thumbnail;
    }

    createThumbnail(slide, index) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'slide-thumbnail';
        thumbnail.dataset.index = index;
        
        // 创建缩略图内容
        const slideClone = slide.cloneNode(true);
        slideClone.style.transform = `scale(${this.scale})`;
        slideClone.style.transformOrigin = 'top left';
        slideClone.style.width = '100%';
        slideClone.style.height = '100%';
        
        // 移除不必要的交互元素
        const interactiveElements = slideClone.querySelectorAll('button, input, select, textarea');
        interactiveElements.forEach(el => el.remove());
        
        thumbnail.innerHTML = `
            <div class="thumbnail-wrapper">
                <div class="thumbnail-content">
                    ${slideClone.outerHTML}
                </div>
                <div class="thumbnail-overlay">
                    <div class="thumbnail-number">${index + 1}</div>
                    <div class="thumbnail-actions">
                        <button class="thumb-action" data-action="goto" title="跳转">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="thumb-action" data-action="edit" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="thumb-action" data-action="duplicate" title="复制">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="thumb-action" data-action="delete" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="thumbnail-title">${this.getSlideTitle(slide, index)}</div>
        `;
        
        // 绑定事件
        this.bindThumbnailEvents(thumbnail, index);
        
        return thumbnail;
    }

    bindThumbnailEvents(thumbnail, index) {
        // 点击跳转
        thumbnail.addEventListener('click', (e) => {
            if (!e.target.closest('.thumb-action')) {
                this.goToSlide(index);
            }
        });
        
        // 双击编辑
        thumbnail.addEventListener('dblclick', () => {
            this.editSlide(index);
        });
        
        // 操作按钮
        const actions = thumbnail.querySelectorAll('.thumb-action');
        actions.forEach(action => {
            action.addEventListener('click', (e) => {
                e.stopPropagation();
                const actionType = action.dataset.action;
                this.handleThumbnailAction(actionType, index);
            });
        });
        
        // 拖拽功能
        if (this.dragReorder) {
            thumbnail.draggable = true;
            thumbnail.addEventListener('dragstart', (e) => this.handleDragStart(e, index));
            thumbnail.addEventListener('dragover', (e) => this.handleDragOver(e));
            thumbnail.addEventListener('drop', (e) => this.handleDrop(e, index));
            thumbnail.addEventListener('dragend', () => this.handleDragEnd());
        }
        
        // 右键菜单
        thumbnail.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e, index);
        });
    }

    handleThumbnailAction(action, index) {
        switch (action) {
            case 'goto':
                this.goToSlide(index);
                break;
            case 'edit':
                this.editSlide(index);
                break;
            case 'duplicate':
                this.duplicateSlide(index);
                break;
            case 'delete':
                this.deleteSlide(index);
                break;
        }
    }

    handleDragStart(e, index) {
        this.isDragging = true;
        this.draggedIndex = index;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        
        // 添加拖拽样式
        e.target.classList.add('dragging');
    }

    handleDragOver(e) {
        if (this.isDragging) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    }

    handleDrop(e, targetIndex) {
        if (this.isDragging && this.draggedIndex !== null) {
            e.preventDefault();
            
            if (this.draggedIndex !== targetIndex) {
                this.reorderSlides(this.draggedIndex, targetIndex);
            }
        }
    }

    handleDragEnd() {
        this.isDragging = false;
        this.draggedIndex = null;
        
        // 移除拖拽样式
        const draggingElement = document.querySelector('.slide-thumbnail.dragging');
        if (draggingElement) {
            draggingElement.classList.remove('dragging');
        }
    }

    reorderSlides(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        
        // 在iframe架构中，重新排列PPTState.slides数组
        if (!window.PPTState || !window.PPTState.slides) {
            console.error('PPTState.slides not available');
            return;
        }
        
        const slides = window.PPTState.slides;
        if (fromIndex < 0 || fromIndex >= slides.length || toIndex < 0 || toIndex >= slides.length) {
            console.error('Invalid slide indices');
            return;
        }
        
        // 移动数组元素
        const slideToMove = slides[fromIndex];
        slides.splice(fromIndex, 1);
        slides.splice(toIndex, 0, slideToMove);
        
        // 更新当前幻灯片索引
        if (window.PPTState.currentSlide === fromIndex) {
            window.PPTState.currentSlide = toIndex;
        } else if (window.PPTState.currentSlide > fromIndex && window.PPTState.currentSlide <= toIndex) {
            window.PPTState.currentSlide--;
        } else if (window.PPTState.currentSlide < fromIndex && window.PPTState.currentSlide >= toIndex) {
            window.PPTState.currentSlide++;
        }
        
        // 更新配置文件中的文件顺序
        if (window.PPTConfig && window.PPTConfig.slideFiles) {
            const newFileOrder = slides.map(slide => slide.filename);
            window.PPTConfig.slideFiles.files = newFileOrder;
        }
        
        // 更新幻灯片编号
        this.updateSlideNumbers();
        
        // 重新生成缩略图
        this.generateThumbnails();
        
        // 更新当前幻灯片显示
        if (window.loadSlideByIndex) {
            window.loadSlideByIndex(window.PPTState.currentSlide);
        }
        
        // 显示成功消息
        this.showNotification('success', `已将幻灯片从位置 ${fromIndex + 1} 移动到位置 ${toIndex + 1}`);
        
        // 触发事件
        this.dispatchEvent('slideReordered', {
            fromIndex,
            toIndex,
            currentSlide: this.currentSlide
        });
        
        // 显示成功消息
        this.showNotification('success', '幻灯片已重新排序');
    }
    
    updateSlideNumbers() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            // 更新幻灯片的数据属性
            slide.dataset.slideNumber = index + 1;
            
            // 更新可能存在的幻灯片编号显示
            const numberElement = slide.querySelector('.slide-number');
            if (numberElement) {
                numberElement.textContent = index + 1;
            }
        });
    }
    
    showNotification(type, message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'thumbnail-notification';
        notification.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation'}"></i>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => notification.classList.add('show'), 100);
        
        // 自动移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getSlideTitle(slide, index) {
        // 尝试获取幻灯片标题
        const titleElement = slide.querySelector('h1, h2, .slide-title, .title');
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        
        // 从配置中获取
        if (PPTConfig && PPTConfig.slides && PPTConfig.slides[index]) {
            return PPTConfig.slides[index].title;
        }
        
        return `幻灯片 ${index + 1}`;
    }

    goToSlide(index) {
        if (window.loadSlideByIndex) {
            window.loadSlideByIndex(index);
        }
        this.currentSlide = index;
        this.updateCurrentIndicator();
    }

    editSlide(index) {
        this.goToSlide(index);
        this.hide();
        
        // 触发编辑模式
        this.dispatchEvent('slideEditRequested', { index });
    }

    addSlide() {
        // 当前只在现有幻灯片基础上添加，实际文件创建需要后端支持
        this.showNotification('info', '添加幻灯片功能需要在实际项目中实现文件创建功能');
        
        // 这里可以添加跳转到项目文档的逻辑
        if (confirm('添加新幻灯片需要手动创建HTML文件。是否查看使用文档？')) {
            if (window.openReadme) {
                window.openReadme();
            }
        }
    }

    duplicateSlide(index = this.currentSlide) {
        if (!window.PPTState.slides[index]) {
            this.showNotification('error', '找不到要复制的幻灯片');
            return;
        }
        
        // 复制幻灯片功能需要创建新的HTML文件
        this.showNotification('info', '复制幻灯片功能需要手动创建HTML文件');
        
        const originalSlide = window.PPTState.slides[index];
        if (confirm(`要复制 "${originalSlide.title}" 幻灯片吗？\n\n请手动复制 ${originalSlide.filename} 文件并在config.js中添加新文件。\n\n是否查看使用文档？`)) {
            if (window.openReadme) {
                window.openReadme();
            }
        }
    }

    deleteSlide(index = this.currentSlide) {
        if (window.PPTState.slides.length <= 1) {
            alert('至少需要保留一张幻灯片');
            return;
        }
        
        const slideToDelete = window.PPTState.slides[index];
        if (!slideToDelete) {
            this.showNotification('error', '找不到要删除的幻灯片');
            return;
        }
        
        if (confirm(`确定要删除第 ${index + 1} 张幻灯片 "${slideToDelete.title}" 吗？`)) {
            // 从PPTState中删除
            window.PPTState.slides.splice(index, 1);
            window.PPTState.totalSlides--;
            
            // 从配置中删除
            window.PPTConfig.slideFiles.files.splice(index, 1);
            
            // 调整当前幻灯片索引
            if (window.PPTState.currentSlide >= index && window.PPTState.currentSlide > 0) {
                window.PPTState.currentSlide--;
            }
            
            // 重新生成缩略图
            this.generateThumbnails();
            
            // 跳转到调整后的当前幻灯片
            this.goToSlide(window.PPTState.currentSlide);
            
            // 显示提示
            this.showNotification('success', `已删除幻灯片: ${slideToDelete.filename}`);
            
            this.dispatchEvent('slideDeleted', { index });
        }
    }

    updateThumbnails() {
        // 在iframe架构中，直接重新生成所有缩略图
        this.generateThumbnails();
    }

    updateCurrentIndicator() {
        // 从PPTState获取当前幻灯片索引
        const currentIndex = window.PPTState ? window.PPTState.currentSlide : this.currentSlide;
        
        // 移除之前的当前指示器
        this.thumbnails.forEach(thumb => {
            thumb.classList.remove('current');
        });
        
        // 添加当前指示器
        if (this.thumbnails[currentIndex]) {
            this.thumbnails[currentIndex].classList.add('current');
        }
        
        // 更新本地当前索引
        this.currentSlide = currentIndex;
        
        // 更新信息
        this.updateInfo();
    }

    updateInfo() {
        const slideCount = window.PPTState ? window.PPTState.totalSlides : this.thumbnails.length;
        const currentPosition = (window.PPTState ? window.PPTState.currentSlide : this.currentSlide) + 1;
        
        const slideCountElement = document.getElementById('slide-count');
        const currentPositionElement = document.getElementById('current-position');
        
        if (slideCountElement) {
            slideCountElement.textContent = `${slideCount} 张幻灯片`;
        }
        if (currentPositionElement) {
            currentPositionElement.textContent = `当前: ${currentPosition}/${slideCount}`;
        }
    }

    showContextMenu(e, index) {
        // 创建右键菜单
        const existingMenu = document.querySelector('.thumbnail-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menu = document.createElement('div');
        menu.className = 'thumbnail-context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" data-action="goto">
                <i class="fas fa-arrow-right"></i>
                跳转到此幻灯片
            </div>
            <div class="context-menu-item" data-action="edit">
                <i class="fas fa-edit"></i>
                编辑幻灯片
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" data-action="duplicate">
                <i class="fas fa-copy"></i>
                复制幻灯片
            </div>
            <div class="context-menu-item" data-action="delete">
                <i class="fas fa-trash"></i>
                删除幻灯片
            </div>
        `;
        
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;
        
        document.body.appendChild(menu);
        
        // 绑定菜单事件
        menu.addEventListener('click', (e) => {
            const action = e.target.closest('.context-menu-item')?.dataset.action;
            if (action) {
                this.handleThumbnailAction(action, index);
            }
            menu.remove();
        });
        
        // 点击其他地方关闭菜单
        setTimeout(() => {
            document.addEventListener('click', () => {
                menu.remove();
            }, { once: true });
        }, 100);
    }

    exportThumbnails() {
        // 导出所有缩略图为图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布大小
        const thumbWidth = 200;
        const thumbHeight = 150;
        const cols = 4;
        const rows = Math.ceil(this.thumbnails.length / cols);
        
        canvas.width = thumbWidth * cols;
        canvas.height = thumbHeight * rows;
        
        // 这里需要使用html2canvas库来实现
        // 简化版本，直接下载当前缩略图HTML
        const thumbnailsHTML = document.getElementById('thumbnails-grid').innerHTML;
        const blob = new Blob([thumbnailsHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'slide-thumbnails.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    toggleFullscreen() {
        const panel = document.getElementById('slide-thumbnails-panel');
        panel.classList.toggle('fullscreen');
        
        const btn = document.getElementById('thumb-fullscreen');
        if (panel.classList.contains('fullscreen')) {
            btn.innerHTML = '<i class="fas fa-compress"></i> 退出全屏';
        } else {
            btn.innerHTML = '<i class="fas fa-expand"></i> 全屏';
        }
    }

    show() {
        document.getElementById('slide-thumbnails-panel').style.display = 'block';
        this.isVisible = true;
        this.generateThumbnails();
        this.updateCurrentIndicator();
    }

    hide() {
        document.getElementById('slide-thumbnails-panel').style.display = 'none';
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    showSettings() {
        document.getElementById('thumbnails-settings-panel').style.display = 'block';
    }

    hideSettings() {
        document.getElementById('thumbnails-settings-panel').style.display = 'none';
    }

    saveSettings() {
        this.scale = parseFloat(document.getElementById('thumb-scale').value);
        this.columns = parseInt(document.getElementById('thumb-columns').value);
        this.showTitles = document.getElementById('thumb-show-titles').checked;
        this.showNumbers = document.getElementById('thumb-show-numbers').checked;
        this.autoUpdate = document.getElementById('thumb-auto-update').checked;
        this.dragReorder = document.getElementById('thumb-drag-reorder').checked;
        
        // 保存设置
        localStorage.setItem('slideThumbnailsSettings', JSON.stringify({
            scale: this.scale,
            columns: this.columns,
            showTitles: this.showTitles,
            showNumbers: this.showNumbers,
            autoUpdate: this.autoUpdate,
            dragReorder: this.dragReorder
        }));
        
        // 应用设置
        this.applySettings();
        this.hideSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('slideThumbnailsSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.scale = settings.scale || 0.15;
            this.columns = settings.columns || 4;
            this.showTitles = settings.showTitles !== false;
            this.showNumbers = settings.showNumbers !== false;
            this.autoUpdate = settings.autoUpdate !== false;
            this.dragReorder = settings.dragReorder !== false;
            
            // 更新UI
            document.getElementById('thumb-scale').value = this.scale;
            document.getElementById('thumb-scale-value').textContent = `${Math.round(this.scale * 100)}%`;
            document.getElementById('thumb-columns').value = this.columns;
            document.getElementById('thumb-show-titles').checked = this.showTitles;
            document.getElementById('thumb-show-numbers').checked = this.showNumbers;
            document.getElementById('thumb-auto-update').checked = this.autoUpdate;
            document.getElementById('thumb-drag-reorder').checked = this.dragReorder;
        }
    }

    applySettings() {
        const grid = document.getElementById('thumbnails-grid');
        grid.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
        
        // 重新生成缩略图
        this.generateThumbnails();
    }

    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: { thumbnails: this, ...data }
        });
        document.dispatchEvent(event);
    }
}

// 缩略图样式
const thumbnailStyles = `
    /* 幻灯片缩略图样式 */
    .slide-thumbnails-panel {
        position: fixed;
        top: 10%;
        left: 10%;
        width: 80%;
        height: 80%;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        display: none;
        flex-direction: column;
    }

    .slide-thumbnails-panel.fullscreen {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
    }

    .thumbnails-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        background: var(--background-color);
    }

    .thumbnails-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-primary);
    }

    .thumbnails-controls {
        display: flex;
        gap: 0.5rem;
    }

    .thumb-btn {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.2s ease;
    }

    .thumb-btn:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    .thumbnails-content {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
    }

    .thumbnails-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        padding: 1rem 0;
    }

    .slide-thumbnail {
        position: relative;
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
        background: white;
    }

    .slide-thumbnail:hover {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-md);
    }

    .slide-thumbnail.current {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px var(--primary-color-alpha);
    }

    .slide-thumbnail.dragging {
        opacity: 0.5;
        transform: scale(0.9);
    }

    .thumbnail-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        overflow: hidden;
    }

    .thumbnail-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform-origin: top left;
    }

    .thumbnail-content .slide {
        position: static;
        width: 100%;
        height: 100%;
        transform: none;
    }

    .thumbnail-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .slide-thumbnail:hover .thumbnail-overlay {
        opacity: 1;
    }

    .thumbnail-number {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        background: var(--primary-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.8rem;
        font-weight: 600;
    }

    .thumbnail-actions {
        display: flex;
        gap: 0.5rem;
    }

    .thumb-action {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-primary);
        transition: all 0.2s ease;
    }

    .thumb-action:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .thumbnail-title {
        padding: 0.5rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
        text-align: center;
        border-top: 1px solid var(--border-color);
        background: var(--background-color);
    }

    .thumbnails-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-top: 1px solid var(--border-color);
        background: var(--background-color);
    }

    .thumbnail-info {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .thumbnail-actions {
        display: flex;
        gap: 0.5rem;
    }

    .thumb-action-btn {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.5rem 1rem;
        cursor: pointer;
        color: var(--text-primary);
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }

    .thumb-action-btn:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    /* 设置面板 */
    .thumbnails-settings-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        display: none;
    }

    .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .settings-header h4 {
        margin: 0;
        color: var(--text-primary);
    }

    .settings-close {
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .settings-close:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    .settings-content {
        padding: 1rem;
    }

    .setting-item {
        margin-bottom: 1rem;
    }

    .setting-item label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        font-weight: 500;
    }

    .setting-item input[type="range"] {
        width: 70%;
        margin-right: 0.5rem;
    }

    .setting-item input[type="number"] {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--surface-color);
        color: var(--text-primary);
    }

    .setting-item input[type="checkbox"] {
        margin-right: 0.5rem;
    }

    .settings-actions {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .settings-btn {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--surface-color);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .settings-btn.save {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .settings-btn:hover {
        background: var(--hover-color);
    }

    .settings-btn.save:hover {
        background: var(--primary-color);
        opacity: 0.9;
    }

    /* 右键菜单 */
    .thumbnail-context-menu {
        position: fixed;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1002;
        min-width: 180px;
        overflow: hidden;
    }

    .context-menu-item {
        padding: 0.75rem 1rem;
        cursor: pointer;
        color: var(--text-primary);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .context-menu-item:hover {
        background: var(--hover-color);
    }

    .context-menu-divider {
        height: 1px;
        background: var(--border-color);
    }

    /* 通知样式 */
    .thumbnail-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 1003;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    }

    .thumbnail-notification.show {
        transform: translateX(0);
    }

    .notification-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
    }

    .notification-icon.success {
        background: #28a745;
    }

    .notification-icon.error {
        background: #dc3545;
    }

    .notification-icon.info {
        background: #17a2b8;
    }

    .notification-message {
        flex: 1;
        color: var(--text-primary);
        font-size: 0.9rem;
        line-height: 1.4;
    }

    /* 响应式调整 */
    @media (max-width: 768px) {
        .slide-thumbnails-panel {
            top: 5%;
            left: 5%;
            width: 90%;
            height: 90%;
        }
        
        .thumbnails-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }
        
        .thumbnails-header {
            padding: 0.75rem;
        }
        
        .thumbnails-content {
            padding: 0.75rem;
        }
        
        .thumbnails-footer {
            padding: 0.75rem;
        }
        
        .thumbnail-info {
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .thumbnail-actions {
            flex-direction: column;
        }
    }
`;

// 添加样式到页面
function addThumbnailStyles() {
    if (!document.getElementById('thumbnail-styles')) {
        const style = document.createElement('style');
        style.id = 'thumbnail-styles';
        style.textContent = thumbnailStyles;
        document.head.appendChild(style);
    }
    
    // 添加通知样式
    if (!document.getElementById('thumbnail-notification-styles')) {
        const notificationStyle = document.createElement('style');
        notificationStyle.id = 'thumbnail-notification-styles';
        notificationStyle.textContent = `
            .thumbnail-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .thumbnail-notification.show {
                transform: translateX(0);
            }
            
            .notification-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 0.875rem;
            }
            
            .notification-icon.success {
                background: #10b981;
            }
            
            .notification-icon.error {
                background: #ef4444;
            }
            
            .notification-message {
                font-size: 0.875rem;
                color: #374151;
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .thumbnail-notification {
                    right: 10px;
                    max-width: calc(100% - 20px);
                }
            }
        `;
        document.head.appendChild(notificationStyle);
    }
}

// 初始化缩略图
function initializeSlideThumbnails() {
    addThumbnailStyles();
    const thumbnails = new SlideThumbnails();
    window.slideThumbnails = thumbnails;
    return thumbnails;
}

// 显示/隐藏缩略图面板的全局函数
function showSlideThumbnails() {
    if (window.slideThumbnails) {
        window.slideThumbnails.show();
    } else {
        initializeSlideThumbnails();
        window.slideThumbnails.show();
    }
}

// 自动初始化（可选）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 不自动初始化，等待用户调用
    });
} else {
    // 不自动初始化，等待用户调用
}

// 导出到全局
window.SlideThumbnails = SlideThumbnails;
window.initializeSlideThumbnails = initializeSlideThumbnails;
window.showSlideThumbnails = showSlideThumbnails; 