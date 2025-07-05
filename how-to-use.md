# 📊 HTML PPT 模板完整使用指南

## 🎯 项目介绍

HTML PPT 模板是一个专为 **AI 编辑器**（如 Cursor、Trae 等）设计的现代化演示文稿框架。通过简单的 prompt 指令，您可以快速生成专业级的 HTML 演示文稿，无需复杂的 PowerPoint 操作。

### ✨ 主要特性

- 🤖 **AI 驱动**：专为 AI 编辑器优化的 prompt 模板
- 📁 **模块化设计**：每个幻灯片独立 HTML 文件，便于管理
- 🎨 **现代化 UI**：基于 shadcn/ui 设计语言，美观简洁
- 📱 **响应式布局**：完美适配桌面端和移动端
- ⚡ **零依赖**：纯 HTML、CSS、JavaScript 实现，无需服务器
- 🎛️ **功能丰富**：演示计时器、幻灯片概览、快捷键、拖拽排序等
- 🔧 **样式解耦**：编辑器样式与用户内容样式完全分离

## 📁 项目结构

```
ppt-basic/
├── index.html                 # 主HTML文件（直接打开即可使用）
├── config.js                  # 配置文件（自动同步幻灯片）
├── sync-slides.js             # 幻灯片同步工具（可选）
├── slides/                    # 幻灯片文件夹
│   ├── 01-welcome.html        # 欢迎页
│   ├── 02-features.html       # 功能介绍
│   ├── 03-how-to-use.html     # 使用方法
│   └── [您的新文件]           # AI 生成的文件
├── assets/
│   ├── css/
│   │   ├── main.css          # 主样式文件
│   │   ├── responsive.css    # 响应式样式
│   │   ├── editor.css        # 编辑器样式（与用户内容解耦）
│   │   └── themes/
│   │       ├── apple.css     # shadcn/ui 主题
│   │       ├── minimal.css   # 极简主题
│   │       └── brutalist.css # 新野兽派主题
│   ├── js/
│   │   ├── main.js           # 主控制逻辑
│   │   ├── keyboard.js       # 键盘快捷键
│   │   ├── function-panel.js # 功能面板
│   │   ├── code-highlight.js # 代码语法高亮
│   │   ├── presentation-timer.js # 演示计时器
│   │   ├── slide-thumbnails.js   # 幻灯片缩略图
│   │   └── layout-templates.js   # 布局模板
│   └── images/               # 图片资源
├── README.md                 # 项目说明
└── 使用指南.md               # 详细使用指南
```

## 🚀 快速开始

### 1. 打开AI编辑器
推荐使用以下AI编辑器：
- [Cursor](https://cursor.sh/) - 最推荐
- [Trae](https://trae.ai/) - 强大的AI编程助手
- [Windsurf](https://windsurf.ai/) - 新兴的AI编辑器

### 2. 下载项目
```bash
git clone <repository-url>
cd ppt-basic
```

### 3. 直接使用
**无需任何服务器或复杂配置**，只需：
1. 双击 `index.html` 文件
2. 浏览器自动打开，立即可用

### 4. 使用AI生成内容
在AI编辑器中输入以下优化的prompt：

---

## 🎨 AI 生成 Prompt 模板

### 基础版本

```
请基于本HTML PPT模板创建一个完整的演示文稿。

## 项目结构说明
- 本项目基于iframe架构，自动收集slides/文件夹下的所有HTML文件
- 每个HTML文件都是独立的PPT页面，支持现代化设计
- 你只需要在slides/文件夹中创建HTML文件，系统会自动识别并加载

## 具体任务
请创建一个关于 [在此输入您的主题] 的演示文稿，包含以下内容：

1. 首页：标题、副标题、演讲者信息
2. 目录页：展示主要内容框架
3. 核心内容页：[详细描述您需要的具体内容]
4. 总结页：要点总结
5. 感谢页：联系方式等

## 设计规范
- 使用现代化设计语言、良好的视觉体验，美观的过渡动画与交互元素，高保真设计，高端大气
- 使用 Tailwind CSS， FontAwesome/bootstrap 等开源 UI 组件让界面更加精美、接近真实的网站设计
- 响应式布局，页面比例接近 PPT 的16:9，使用一致的设计语言和层次结构，页面可滚动查看
- 使用真实UI图片（如 Unsplash、 Apple官方 UI 等资源）

## 技术要求
- 将所有幻灯片保存为 slides/ 文件夹下的 HTML 文件
- 文件命名格式：01-welcome.html, 02-agenda.html, 03-content.html...
- 每个文件包含：
  - 幻灯片内容（可直接编写HTML，支持Tailwind CSS）
  - 演讲者备注（用 `<div class="slide-notes">` 包裹）
- 系统会自动识别新文件，无需手动配置

## 设计风格
- 使用 shadcn/ui 风格：现代简洁、深色调、优雅阴影
- 支持 Font Awesome 图标：`<i class="fas fa-icon-name"></i>`
- 支持完整的 Tailwind CSS 类名进行样式调整
- 16:9 比例布局，适合演示

## 内容要求
- 语言：中文
- 使用真实、专业的内容
- 每张幻灯片包含适当的演讲者备注
- 内容要有逻辑性和连贯性
- 使用真实的图片和高质量的视觉元素

开始创建吧！
```

### 高级版本（指定主题）

```
请基于本HTML PPT模板创建一个高端的[商业/学术/创意/个人]演示文稿。

## 演示主题
[详细描述您的演示主题和目标]

## 目标受众
[描述您的目标受众，如：投资者、学术专家、客户等]

## 设计要求
- 使用现代化设计语言，高端大气的视觉效果
- 集成 Tailwind CSS 和 FontAwesome 图标
- 响应式设计，完美适配各种设备
- 使用真实UI图片和专业图标
- 优雅的过渡动画和交互元素

## 内容结构
请创建以下幻灯片，每个都要符合现代化设计规范：

1. 01-cover.html - 封面页
   - 使用大气的背景图片
   - 现代化标题设计
   - 优雅的动画效果

2. 02-agenda.html - 议程页
   - 清晰的时间轴设计
   - 使用卡片式布局
   - 图标化的内容展示

3. 03-problem.html - 问题分析
   - 数据可视化展示
   - 使用对比色突出重点
   - 专业的图表和统计

4. 04-solution.html - 解决方案
   - 分步骤的流程图
   - 使用渐变和阴影效果
   - 互动式元素

5. 05-benefits.html - 价值亮点
   - 网格布局展示优势
   - 使用真实案例图片
   - 突出的数据展示

6. 06-roadmap.html - 路线图
   - 时间轴设计
   - 里程碑式展示
   - 渐进式动画

7. 07-thanks.html - 感谢页
   - 极简设计风格
   - 联系方式卡片
   - 社交媒体链接

## 特殊要求
- 每个文件都要包含丰富的演讲者备注
- 使用专业的设计元素和真实图片
- 保持视觉一致性和品牌统一
- 考虑演示的节奏和观众体验

## 样式示例
```html
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
    <div class="max-w-4xl w-full bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
        <h1 class="text-5xl font-bold text-white mb-6 leading-tight">
            <i class="fas fa-rocket text-purple-400 mr-4"></i>
            您的标题
        </h1>
        <!-- 更多内容 -->
    </div>
</div>
```

请确保所有文件都符合现代化设计规范，并提供详细的演讲者备注。
```

## 🎛️ 功能面板

### 打开功能面板
- **快捷键**：`Ctrl + /` (Windows/Linux) 或 `Cmd + /` (Mac)
- **按钮**：点击右下角的齿轮图标

### 功能面板包含四个标签页：

#### 1. 功能列表
- **演示功能**：计时器、演讲者模式、全屏、黑屏
- **编辑功能**：幻灯片概览、布局模板、代码高亮
- **导航功能**：幻灯片搜索、跳转到指定幻灯片
- **管理功能**：拖拽排序、添加删除幻灯片

#### 2. 快捷键
- **基本导航**：方向键切换、数字键跳转
- **演示控制**：全屏、演讲者模式、黑屏
- **编辑功能**：概览、模板、搜索
- **管理功能**：拖拽排序、批量操作

#### 3. 使用教程
- **基本导航**：如何切换幻灯片
- **演示模式**：专业演示技巧
- **编辑功能**：内容编辑和管理
- **高级技巧**：提高效率的方法

#### 4. 关于
- **项目信息**：版本信息、技术规格
- **更新日志**：新增功能列表

## ⌨️ 键盘快捷键

### 基本导航
| 快捷键 | 功能 |
|--------|------|
| `← →` | 上一张/下一张幻灯片 |
| `↑ ↓` | 上一张/下一张幻灯片（可选） |
| `Space` | 下一张幻灯片 |
| `Home` | 第一张幻灯片 |
| `End` | 最后一张幻灯片 |
| `1-9` | 跳转到指定幻灯片 |

### 演示控制
| 快捷键 | 功能 |
|--------|------|
| `F11` | 全屏/退出全屏 |
| `Esc` | 退出全屏 |
| `S` | 演讲者模式（显示/隐藏备注） |
| `B` 或 `.` | 黑屏模式 |
| `Alt + T` | 演示计时器 |

### 编辑功能
| 快捷键 | 功能 |
|--------|------|
| `Alt + O` | 幻灯片概览（支持拖拽排序） |
| `Alt + L` | 布局模板 |
| `Ctrl/Cmd + F` | 搜索幻灯片 |

### 功能面板
| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + /` | 打开/关闭功能面板 |

## 🔧 主要功能详解

### 1. 演示计时器

专业的演示时间管理工具，帮助您控制演示节奏。

#### 功能特点：
- **精确计时**：毫秒级计时精度
- **目标时间设置**：可设置演示目标时间
- **时间警告**：接近时间限制时自动提醒
- **幻灯片统计**：记录每张幻灯片的停留时间
- **最小化模式**：不干扰演示的小窗口模式

#### 使用方法：
1. 按 `Alt + T` 或点击计时器按钮
2. 设置目标演示时间
3. 点击"开始"按钮开始计时
4. 演示过程中可以暂停/恢复
5. 演示结束后查看详细统计

### 2. 幻灯片概览与拖拽排序

查看所有幻灯片的缩略图，支持拖拽排序和批量操作。

#### 功能特点：
- **智能缩略图**：自动生成幻灯片预览图
- **拖拽排序**：直接拖拽调整幻灯片顺序
- **快速导航**：点击缩略图直接跳转
- **批量操作**：添加、复制、删除幻灯片
- **全屏模式**：专门的缩略图管理界面

#### 使用方法：
1. 按 `Alt + O` 或点击概览按钮
2. 查看所有幻灯片缩略图
3. **拖拽缩略图调整顺序**
4. 右键点击进行批量操作
5. 双击缩略图进入编辑模式

### 3. 布局模板系统

10种专业的幻灯片布局模板，快速创建美观的幻灯片。

#### 可用模板：
1. **封面页**：用于演示文稿的开头
2. **内容页**：标准的文本内容布局
3. **双栏布局**：左右两栏内容
4. **图文混排**：图片和文字的组合
5. **代码展示**：专门用于代码演示
6. **对比布局**：两项内容的对比
7. **时间轴**：展示时间序列
8. **图片画廊**：多图片展示
9. **引用页**：用于引用和名言
10. **联系方式**：联系信息展示

#### 使用方法：
1. 按 `Alt + L` 或点击模板按钮
2. 浏览可用的布局模板
3. 点击预览查看效果
4. 点击"应用"将模板应用到当前幻灯片
5. 根据需要修改模板内容

### 4. 代码语法高亮

自动检测和高亮代码块，支持多种编程语言。

#### 支持的语言：
- JavaScript, TypeScript, Python, Java, C++, C#
- HTML, CSS, XML, JSON, YAML
- Bash, PowerShell, SQL
- Go, Rust, Swift, Kotlin

#### 使用方法：
1. 在幻灯片中添加代码块
2. 使用 `<pre><code class="language-javascript">` 格式
3. 系统自动应用语法高亮
4. 支持行号和代码复制功能

### 5. 演讲者备注

专业的演讲者备注系统，帮助您在演示时参考要点。

#### 功能特点：
- **底部面板**：不干扰主要内容的备注显示
- **快捷切换**：按 `S` 键快速显示/隐藏备注
- **自动同步**：备注内容自动从幻灯片中提取
- **优雅设计**：透明背景，现代化界面

#### 使用方法：
1. 在幻灯片HTML中添加 `<div class="slide-notes">备注内容</div>`
2. 演示时按 `S` 键显示备注
3. 备注会显示在页面底部
4. 再次按 `S` 键隐藏备注

## 📝 幻灯片文件格式

每个幻灯片文件应包含以下结构：

```html
<!-- 幻灯片内容 -->
<div class="slide-content">
    <!-- 使用Tailwind CSS和现代化设计 -->
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-8">
        <div class="max-w-4xl w-full bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <h1 class="text-5xl font-bold text-white mb-6 leading-tight">
                <i class="fas fa-rocket text-purple-400 mr-4"></i>
                幻灯片标题
            </h1>
            <p class="text-xl text-gray-300 mb-8">
                这里是幻灯片的主要内容...
            </p>
            
            <!-- 可以使用各种HTML元素和Tailwind CSS类 -->
            <div class="grid grid-cols-2 gap-8">
                <div class="bg-white/5 rounded-2xl p-6">
                    <h3 class="text-2xl font-semibold text-white mb-4">
                        <i class="fas fa-star text-yellow-400 mr-2"></i>
                        要点一
                    </h3>
                    <p class="text-gray-300">详细描述...</p>
                </div>
                <div class="bg-white/5 rounded-2xl p-6">
                    <h3 class="text-2xl font-semibold text-white mb-4">
                        <i class="fas fa-lightbulb text-blue-400 mr-2"></i>
                        要点二
                    </h3>
                    <p class="text-gray-300">详细描述...</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 演讲者备注 -->
<div class="slide-notes">
    这里是演讲者备注，可以包含：
    - 演讲要点
    - 时间控制提示
    - 互动环节说明
    - 补充信息
</div>
```

## 🎨 设计指南

### 推荐的设计元素
1. **颜色方案**：使用 Tailwind 的调色板
2. **字体**：系统字体栈，保证跨平台兼容
3. **图标**：FontAwesome 图标库
4. **布局**：Flexbox 和 Grid 布局
5. **动画**：CSS transition 和 transform
6. **图片**：高质量的 Unsplash 图片

### 样式示例
```html
<!-- 现代化卡片设计 -->
<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
    <div class="flex items-center mb-6">
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fas fa-rocket text-white"></i>
        </div>
        <h3 class="text-2xl font-bold text-white ml-4">功能标题</h3>
    </div>
    <p class="text-gray-300 leading-relaxed">功能描述...</p>
</div>

<!-- 渐变背景 -->
<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <!-- 内容 -->
</div>

<!-- 响应式网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <!-- 网格项目 -->
</div>
```

## 🔧 自动同步与配置

### 自动文件识别
- 系统会自动扫描 `slides/` 文件夹
- 按文件名排序加载幻灯片
- 支持热重载，添加文件后刷新页面即可

### 可选的同步脚本
如果您有 Node.js 环境，可以使用同步脚本：

```bash
# 自动同步slides文件夹中的所有HTML文件
node sync-slides.js
```

### 配置说明
系统会自动管理 `config.js` 文件，无需手动配置。

## 🚀 高级技巧

### 1. 使用真实图片
```html
<!-- 使用 Unsplash 的高质量图片 -->
<img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
     alt="现代办公环境" 
     class="w-full h-64 object-cover rounded-2xl">
```

### 2. 创建动画效果
```html
<!-- 渐入动画 -->
<div class="opacity-0 animate-fade-in">
    <h2 class="text-4xl font-bold">标题</h2>
</div>

<!-- 添加自定义CSS -->
<style>
@keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.6s ease-out;
}
</style>
```

### 3. 响应式设计
```html
<!-- 移动端适配 -->
<div class="p-4 md:p-8 lg:p-12">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold">
        响应式标题
    </h1>
</div>
```

## 🎯 最佳实践

### 1. 内容组织
- 每张幻灯片专注一个主题
- 使用清晰的标题层次
- 保持视觉一致性

### 2. 设计原则
- 遵循 16:9 比例
- 使用充足的留白空间
- 保持字体大小适中

### 3. 演示技巧
- 使用演讲者备注
- 合理控制演示时间
- 预览所有幻灯片

### 4. 性能优化
- 优化图片大小
- 避免过度的动画效果
- 保持代码简洁

## 📱 移动端支持

本模板完全支持移动端设备：
- 响应式布局自动适配
- 触摸滑动切换幻灯片
- 移动端优化的控件
- 竖屏模式支持

## 🔍 故障排除

### 常见问题

1. **幻灯片不显示**
   - 确保HTML文件在slides/文件夹中
   - 检查文件名格式是否正确

2. **拖拽功能不工作**
   - 确保使用Alt+O打开概览面板
   - 检查浏览器兼容性

3. **图片不显示**
   - 使用完整的URL路径
   - 检查图片资源是否可访问

4. **样式不生效**
   - 确保使用正确的Tailwind CSS类名
   - 检查HTML语法是否正确

## 🤝 贡献指南

欢迎贡献代码和建议：
1. Fork 本项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：
- 创建 GitHub Issue
- 发送邮件至：[your-email@example.com]

---

**享受创建精美PPT的过程！** 🎉

