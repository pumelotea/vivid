import {defineConfig} from 'vitepress'
const fileAndStyles = {}


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
	vite: {
		ssr: {
			noExternal: ['naive-ui', 'date-fns', 'vueuc']
		}
	},
	postRender(context) {
		const styleRegex = /<css-render-style>((.|\s)+)<\/css-render-style>/
		const vitepressPathRegex = /<vitepress-path>(.+)<\/vitepress-path>/
		const style = styleRegex.exec(context.content)?.[1]
		const vitepressPath = vitepressPathRegex.exec(context.content)?.[1]
		if (vitepressPath && style) {
			fileAndStyles[vitepressPath] = style
		}
		context.content = context.content.replace(styleRegex, '')
		context.content = context.content.replace(vitepressPathRegex, '')
	},
	transformHtml(code, id) {
		const html = id.split('/').pop()
		if (!html) return
		const style = fileAndStyles[`/${html}`]
		if (style) {
			return code.replace(/<\/head>/, style + '</head>')
		}
	}
})
