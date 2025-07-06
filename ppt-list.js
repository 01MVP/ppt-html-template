// PPT 项目配置文件
// 创建新的 PPT 项目后，请在这里添加项目信息和文件列表
window.pptProjects = {
    'default': {
        name: '默认演示',
        description: 'HTML PPT模板介绍',
        badge: '默认',
        badgeClass: 'default',
        files: [
            '01-cover.html',
            '02-features.html',
            '03-quickstart.html',
            '04-operation.html',
            '05-philosophy.html',
            '06-examples.html',
            '07-tech.html',
            '08-thanks.html'
        ]
    },
    'examples/minimal': {
        name: '极简主义',
        description: '简洁优雅、专业商务',
        badge: '商务',
        badgeClass: 'professional',
        files: [
            '01-cover.html',
            '02-content.html',
            '03-thanks.html'
        ]
    },
    'examples/neobrutalism': {
        name: '新野兽派',
        description: '大胆色彩、强视觉冲击',
        badge: '创意',
        badgeClass: 'creative',
        files: [
            '01-cover.html',
            '02-content.html',
            '03-thanks.html'
        ]
    }
    // 添加新项目示例：
    // 'my-presentation': {
    //     name: '我的演示',
    //     description: '自定义演示文稿',
    //     badge: '自定义',
    //     badgeClass: 'custom',
    //     files: [
    //         '01-cover.html',
    //         '02-content.html',
    //         '03-thanks.html'
    //     ]
    // }
}; 