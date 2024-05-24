import Placeholder from '@tiptap/extension-placeholder'

export function usePlaceholder(options) {
	if (!options) {
		options = {
			placeholder: ({ node, pos }) => {
				console.log(node.type?.name === 'heading')
				if (node?.type?.name === 'heading') {
					return `标题${node.attrs.level}`
				}
				if (node?.type?.name === 'codeBlock') {
					return ''
				}
				if (pos === 0) {
					return '请输入正文'
				}
				return `输入 '/' 唤起更多`
			},
		}
	}
	return Placeholder.configure(options)
}
