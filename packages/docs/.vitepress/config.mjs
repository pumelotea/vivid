import {defineConfig} from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Vivid',
  description: '一个基于tiptap和naive-ui的现代富文本编辑器',
  head: [
    ['link', {rel: 'icon', href: '/logo.svg'}],
  ],
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    lastUpdatedText: 'Updated Date',
    nav: [
      {text: 'Github', link: "https://github.com/pumelotea/vivid",},
    ],
    footer: {
      message: "Powered by CodeCodeRun",
      copyright: 'Copyright © 2023-present CodeCodeRun'
    },
    docFooter: {
      prev: '上一节',
      next: '下一节'
    },
    sidebar: [
      {
        text: '开放平台对接文档',
        items: [
          {text: '对接流程', link: '/flow/index.html'},
          {text: '准备工作', link: '/quick/index.html'},
          {text: 'JSSDK', link: '/jssdk/index.html'},
          {text: '服务端接口', link: '/server-api/index.html'},
          {text: 'Demo代码', link: '/demo/index.html'},
        ]
      }
    ],
  },
})
