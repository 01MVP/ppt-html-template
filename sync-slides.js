#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SLIDES_DIR = './ppt/default';
const CONFIG_FILE = './config.js';

console.log('🔄 HTML PPT 幻灯片同步工具');
console.log('============================');

// 检查ppt/default文件夹是否存在
if (!fs.existsSync(SLIDES_DIR)) {
    console.error('❌ ppt/default文件夹不存在！');
    console.log('💡 请确保项目根目录中有ppt/default文件夹');
    process.exit(1);
}

// 扫描ppt/default文件夹
const files = fs.readdirSync(SLIDES_DIR)
    .filter(file => file.endsWith('.html'))
    .sort();

if (files.length === 0) {
    console.log('⚠️  ppt/default文件夹中没有找到HTML文件');
    console.log('💡 请在ppt/default文件夹中创建HTML幻灯片文件');
    process.exit(0);
}

console.log(`📁 找到 ${files.length} 个HTML文件：`);
files.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
});

// 读取config.js文件
if (!fs.existsSync(CONFIG_FILE)) {
    console.error('❌ config.js文件不存在！');
    process.exit(1);
}

let configContent = fs.readFileSync(CONFIG_FILE, 'utf8');

// 构建新的文件列表
const fileListString = files.map(file => `            '${file}'`).join(',\n');

// 更新config.js中的files数组
const updatedContent = configContent.replace(
    /(files:\s*\[)[^}]*(\],)/s,
    `$1\n${fileListString}\n        $2`
);

// 写回config.js文件
fs.writeFileSync(CONFIG_FILE, updatedContent);

console.log('✅ config.js文件已更新！');
console.log('');
console.log('🎯 下一步：');
console.log('   1. 双击打开 index.html');
console.log('   2. 开始使用您的PPT模板');
console.log('');
console.log('💡 提示：每次添加新的幻灯片文件后，');
console.log('   都可以运行此脚本来自动更新配置。'); 