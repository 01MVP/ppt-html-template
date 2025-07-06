/**
 * HTML PPT 模板配置文件
 * 
 * 这个文件定义了PPT的基本设置和幻灯片信息
 * 用户可以通过修改这个文件来自定义PPT的行为
 */

// PPT 基本配置
const PPTConfig = {
    // 演示文稿标题
    title: "HTML PPT 模板",
    
    // 作者信息
    author: "Your Name",
    
    // 当前主题 (apple, minimal, brutalist)
    theme: "apple",
    
    // 幻灯片文件夹配置
    slideFiles: {
        // PPT文件夹路径
        basePath: "ppt/default/",
        
        // 自动检测ppt文件夹下的html文件
        autoDetect: true,
        
        // 文件排序方式：'name' | 'date' | 'custom'
        sortBy: 'name',
        
        // 幻灯片文件列表（按顺序加载）
        files: [
            '01-welcome.html',
            '02-features.html', 
            '03-how-to-use.html'
        ],
        
        // 幻灯片标题提取方式
        titleExtraction: {
            // 从文件名提取标题
            fromFilename: true,
            // 从HTML内容中的第一个h1/h2标签提取
            fromContent: true,
            // 默认标题前缀
            defaultPrefix: "幻灯片"
        }
    },
    
    // 幻灯片信息 (动态加载，这里作为默认结构)
    slides: [
        {
            id: "welcome",
            title: "HTML PPT 模板",
            layout: "cover"
        },
        {
            id: "features",
            title: "强大功能",
            layout: "content"
        },
        {
            id: "how-to-use",
            title: "快速上手",
            layout: "content"
        }
    ],
    
    // 演示设置
    settings: {
        // 是否自动播放
        autoplay: false,
        
        // 自动播放间隔 (毫秒)
        autoplayInterval: 5000,
        
        // 过渡效果 (slide, fade, zoom, none)
        transition: "slide",
        
        // 过渡动画时长 (毫秒)
        transitionDuration: 300,
        
        // 是否显示控制按钮
        showControls: true,
        
        // 是否显示进度条
        showProgress: true,
        
        // 是否启用键盘导航
        keyboard: true,
        
        // 是否启用触摸支持
        touch: true,
        
        // 是否循环播放
        loop: false,
        
        // 是否显示幻灯片编号
        showSlideNumber: true,
        
        // 移动端是否隐藏侧边栏
        hideSidebarOnMobile: true,
        
        // 是否在移动端显示底部导航
        showMobileNav: true
    },
    
    // 主题配置
    themes: {
        apple: {
            name: "shadcn/ui 风格",
            description: "现代简洁风格，采用 shadcn/ui 设计语言，简洁边框和阴影",
            cssFile: "assets/css/themes/apple.css",
            primaryColor: "#18181b",
            backgroundColor: "#ffffff",
            textColor: "#0f172a"
        },
        minimal: {
            name: "极简风格", 
            description: "黑白配色、几何图形、大字体、高对比度",
            cssFile: "assets/css/themes/minimal.css",
            primaryColor: "#000000",
            backgroundColor: "#ffffff",
            textColor: "#000000"
        },
        brutalist: {
            name: "新野兽派",
            description: "大胆色彩、粗体字、不规则布局、强视觉冲击",
            cssFile: "assets/css/themes/brutalist.css",
            primaryColor: "#FF0000",
            backgroundColor: "#000000",
            textColor: "#FFFFFF"
        }
    },
    
    // 键盘快捷键配置
    keyboard: {
        // 上一张幻灯片
        prev: ['ArrowLeft', 'ArrowUp', 'PageUp'],
        
        // 下一张幻灯片
        next: ['ArrowRight', 'ArrowDown', 'PageDown', 'Space'],
        
        // 首页
        home: ['Home'],
        
        // 末页
        end: ['End'],
        
        // 全屏
        fullscreen: ['F11'],
        
        // 退出全屏
        exitFullscreen: ['Escape'],
        
        // 帮助
        help: ['KeyH', 'F1'],
        

        
        // 切换主题
        theme: ['KeyT'],
        
        // 黑屏
        blackout: ['KeyB', 'Period']
    },
    
    // 响应式断点
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    
    // AI 提示词模板
    aiPrompts: {
        themes: {
            apple: "请创建一个 shadcn/ui 风格的演示，特点：现代简洁风格、采用 shadcn/ui 设计语言、简洁边框和阴影。使用系统字体，采用深色调作为主色调，注重视觉层次和现代感。",
            minimal: "请创建一个极简风格的演示，特点：黑白配色、几何图形、大字体、高对比度。使用无衬线字体，强调内容的纯粹性和功能性。",
            brutalist: "请创建一个新野兽派风格的演示，特点：大胆色彩、粗体字、不规则布局、强视觉冲击。使用对比强烈的色彩，打破常规的设计规则。"
        },
        
        scenarios: {
            business: "商业演示：产品发布、年度总结、商业计划书、团队汇报",
            academic: "学术演示：研究报告、论文答辩、学术会议、课程讲解",
            creative: "创意演示：设计展示、艺术作品、创意提案、品牌展示",
            personal: "个人演示：自我介绍、作品集、经验分享、学习总结"
        },
        
        // 生成完整提示词的函数
        generatePrompt: function(theme, scenario, customContent) {
            const themeDesc = this.themes[theme] || this.themes.apple;
            const scenarioDesc = this.scenarios[scenario] || this.scenarios.business;
            
            return `
请为我创建一个${themeDesc}的${scenarioDesc}演示文稿。

内容要求：
${customContent || '请根据主题和场景自定义内容'}

技术要求：
- 使用纯HTML + CSS + JavaScript
- 每张幻灯片使用独立的HTML文件
- 响应式设计，适配桌面和移动设备
- 遵循我们的布局模板结构

输出格式：
- 生成完整的HTML幻灯片文件
- 包含必要的CSS样式
- 提供清晰的文件组织结构
- 添加适当的注释说明

主题风格：${theme}
使用场景：${scenario}
            `;
        }
    },
    
    // 版本信息
    version: "1.0.0",
    
    // 更新日志
    changelog: [
        {
            version: "1.0.0",
            date: "2024-01-01",
            changes: [
                "初始版本发布",
                "支持三种主题风格",
                "响应式设计实现",
                "键盘导航功能",
                "AI提示词模板"
            ]
        }
    ]
};

// 导出配置（兼容不同的模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PPTConfig;
}

// 使配置在全局可用
window.PPTConfig = PPTConfig; 