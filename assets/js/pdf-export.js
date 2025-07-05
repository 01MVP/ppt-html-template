// PDF导出功能
class PDFExporter {
    constructor() {
        this.exportWindow = null;
        this.slidesToExport = [];
    }

    // 导出为PDF
    async exportToPDF() {
        try {
            console.log('开始PDF导出...');
            
            // 获取所有slides数据
            if (!window.PPTState || !window.PPTState.slides) {
                throw new Error('没有找到可导出的幻灯片数据');
            }

            this.slidesToExport = window.PPTState.slides;
            
            // 创建导出专用窗口
            await this.createExportWindow();
            
            // 生成打印页面内容
            await this.generatePrintContent();
            
            // 等待内容加载完成
            await this.waitForContentLoad();
            
            // 触发打印
            this.triggerPrint();
            
        } catch (error) {
            console.error('PDF导出失败:', error);
            alert('PDF导出失败: ' + error.message);
        }
    }

    // 创建导出专用窗口
    createExportWindow() {
        return new Promise((resolve) => {
            // 创建新窗口
            this.exportWindow = window.open('', '_blank', 'width=1200,height=800');
            
            if (!this.exportWindow) {
                throw new Error('无法创建导出窗口，请允许弹窗');
            }

            // 基础HTML结构
            this.exportWindow.document.write(`
                <!DOCTYPE html>
                <html lang="zh-CN">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>PPT导出 - PDF版本</title>
                    
                    <!-- 引入原有样式 -->
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                    
                    <style>
                        /* PDF专用样式 */
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }

                        @page {
                            size: 297mm 167.0625mm; /* 16:9 比例 A4横向 */
                            margin: 0;
                        }

                        body {
                            font-family: 'Inter', sans-serif;
                            margin: 0;
                            padding: 0;
                            background: white;
                        }

                        .slide-page {
                            width: 297mm;
                            height: 167.0625mm;
                            page-break-after: always;
                            page-break-inside: avoid;
                            position: relative;
                            overflow: hidden;
                            background: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .slide-page:last-child {
                            page-break-after: avoid;
                        }

                        .slide-content {
                            width: 100%;
                            height: 100%;
                            position: relative;
                            overflow: hidden;
                        }

                        .slide-iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                            background: transparent;
                        }

                        /* 屏幕显示样式 */
                        @media screen {
                            body {
                                background: #f0f0f0;
                                padding: 20px;
                            }

                            .slide-page {
                                margin-bottom: 20px;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                                border-radius: 8px;
                                width: 800px;
                                height: 450px;
                            }

                            .export-header {
                                text-align: center;
                                margin-bottom: 30px;
                                padding: 20px;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }

                            .export-actions {
                                margin-bottom: 20px;
                                text-align: center;
                            }

                            .export-btn {
                                padding: 12px 24px;
                                margin: 0 10px;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 16px;
                                transition: all 0.3s ease;
                            }

                            .export-btn.primary {
                                background: #3b82f6;
                                color: white;
                            }

                            .export-btn.primary:hover {
                                background: #2563eb;
                            }

                            .export-btn.secondary {
                                background: #e5e7eb;
                                color: #374151;
                            }

                            .export-btn.secondary:hover {
                                background: #d1d5db;
                            }
                        }

                        /* 打印时隐藏控制元素 */
                        @media print {
                            .export-header,
                            .export-actions {
                                display: none !important;
                            }

                            .slide-page {
                                margin: 0;
                                box-shadow: none;
                                border-radius: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="export-header">
                        <h1>PPT导出预览</h1>
                        <p>共 ${this.slidesToExport.length} 页幻灯片，16:9比例</p>
                    </div>
                    
                    <div class="export-actions">
                        <button class="export-btn primary" onclick="window.print()">
                            <i class="fas fa-download"></i> 导出PDF
                        </button>
                        <button class="export-btn secondary" onclick="window.close()">
                            <i class="fas fa-times"></i> 关闭
                        </button>
                    </div>
                    
                    <div id="slides-container">
                        <!-- 幻灯片内容将在这里动态加载 -->
                    </div>
                </body>
                </html>
            `);
            
            this.exportWindow.document.close();
            
            // 等待窗口加载完成
            this.exportWindow.onload = () => {
                resolve();
            };
        });
    }

    // 生成打印内容
    async generatePrintContent() {
        const container = this.exportWindow.document.getElementById('slides-container');
        
        // 为每个slide创建一页
        for (let i = 0; i < this.slidesToExport.length; i++) {
            const slide = this.slidesToExport[i];
            
            const slidePage = this.exportWindow.document.createElement('div');
            slidePage.className = 'slide-page';
            slidePage.innerHTML = `
                <div class="slide-content">
                    <iframe class="slide-iframe" src="${slide.filepath}" frameborder="0"></iframe>
                </div>
            `;
            
            container.appendChild(slidePage);
        }
    }

    // 等待内容加载完成
    waitForContentLoad() {
        return new Promise((resolve) => {
            const iframes = this.exportWindow.document.querySelectorAll('.slide-iframe');
            let loadedCount = 0;
            
            const checkAllLoaded = () => {
                loadedCount++;
                if (loadedCount >= iframes.length) {
                    // 额外等待一段时间确保内容完全渲染
                    setTimeout(resolve, 2000);
                }
            };

            if (iframes.length === 0) {
                resolve();
                return;
            }

            iframes.forEach(iframe => {
                iframe.onload = checkAllLoaded;
                iframe.onerror = checkAllLoaded;
                
                // 设置超时，避免某些iframe加载失败时卡住
                setTimeout(checkAllLoaded, 5000);
            });
        });
    }

    // 触发打印
    triggerPrint() {
        // 聚焦到导出窗口
        this.exportWindow.focus();
        
        // 延迟触发打印，确保窗口完全加载
        setTimeout(() => {
            this.exportWindow.print();
        }, 500);
    }
}

// 创建全局实例
window.pdfExporter = new PDFExporter();

// 导出函数供HTML调用
function exportToPDF() {
    if (window.pdfExporter) {
        window.pdfExporter.exportToPDF();
    } else {
        console.error('PDF导出器未初始化');
        alert('PDF导出功能未就绪，请稍后再试');
    }
}

// 导出到全局作用域
window.exportToPDF = exportToPDF; 