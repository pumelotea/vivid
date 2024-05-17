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
      message: "Powered by CodeCode.Run",
      copyright: 'Copyright © 2023-present CodeCode.Run'
    },
    docFooter: {
      prev: '上一节',
      next: '下一节'
    },
  },
})
