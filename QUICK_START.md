# 🚀 快速开始指南

## 📋 项目概述

这是一个专为AI编辑器设计的HTML PPT模板，让你可以轻松创建专业的演示文稿。

## ⚡ 5分钟快速上手

### 1. 立即使用（推荐）
```bash
# 双击打开
双击 index.html 文件
```

### 2. 使用AI生成内容
在AI编辑器中输入：
```
请为我创建一个关于"产品发布"的HTML PPT演示：
- 在slides/文件夹中创建HTML文件
- 使用现代化设计和Tailwind CSS
- 包含封面、产品介绍、功能特性、总结等页面
```

### 3. 手动创建
在 `slides/` 文件夹中直接创建 HTML 文件，刷新浏览器即可看到效果。

> **🎯 面向人群：** 本项目专为编程小白设计，**完全零依赖**，无需安装任何开发工具！

## 🎯 核心文件说明

```
项目结构：
├── index.html          # 主入口文件
├── slides/             # 🎯 幻灯片文件夹（重要！）
│   ├── 01-welcome.html
│   ├── 02-features.html
│   └── 03-how-to-use.html
├── assets/             # 资源文件
│   ├── css/            # 样式文件
│   └── js/             # JavaScript文件
├── config.js           # 配置文件
└── sync-slides.js      # 同步工具
```

## 📝 常用操作

### 创建新幻灯片
1. 在`slides/`文件夹中创建HTML文件
2. 使用命名规则：`01-title.html`、`02-content.html`
3. 刷新浏览器即可看到新内容

### 使用AI生成
```
AI提示词模板：
"请在slides/文件夹中创建一个关于[主题]的HTML演示文稿，包含：
- 封面页 (01-cover.html)
- 内容页 (02-content.html)
- 总结页 (03-summary.html)
使用Tailwind CSS和现代化设计"
```

### 快捷键
- `→` / `Space` - 下一张
- `←` - 上一张
- `F11` - 全屏
- `Ctrl + /` - 功能面板

## 🛠️ 开发工具

### 推荐的AI编辑器
- **[Cursor](https://cursor.sh/)** - 首选
- **[Trae](https://trae.ai/)** - 强大的AI助手
- **[Windsurf](https://windsurf.ai/)** - 新兴编辑器

### 使用方法
```bash
# 方式1：直接双击
双击 index.html 文件

# 方式2：同步幻灯片（可选）
node sync-slides.js

# 方式3：在浏览器中打开
打开浏览器 → 拖拽 index.html 到浏览器
```

## 🎨 自定义样式

### 使用内置主题
项目提供三种主题：
- `apple` - 现代简洁（默认）
- `minimal` - 极简黑白
- `brutalist` - 大胆色彩

### 自定义CSS
在幻灯片HTML文件中使用Tailwind CSS：
```html
<div class="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
    <h1 class="text-6xl font-bold text-white">我的标题</h1>
</div>
```

## 🔧 常见问题

### Q: 新幻灯片不显示？
A: 确保文件在`slides/`文件夹中，然后刷新浏览器

### Q: 如何修改主题？
A: 修改`config.js`中的`theme`字段，或在`assets/css/themes/`添加自定义主题

### Q: 支持哪些浏览器？
A: 现代浏览器（Chrome、Firefox、Safari、Edge）

## 📚 进阶使用

### 1. 自定义配置
编辑`config.js`文件：
```javascript
const PPTConfig = {
    title: "我的演示",
    theme: "apple",
    settings: {
        autoplay: false,
        showProgress: true
    }
};
```

### 2. 添加新功能
在`assets/js/`文件夹中添加自定义JavaScript

### 3. 部署发布
```bash
# 直接部署
# 上传整个项目文件夹到GitHub Pages、Netlify等静态托管服务
# 或者打包成ZIP文件分享给他人
```

## 🎉 开始创作

现在你可以：
1. 直接使用现有模板
2. 让AI帮你生成内容
3. 自定义样式和布局
4. 分享你的演示

**祝你创作愉快！** 🚀 