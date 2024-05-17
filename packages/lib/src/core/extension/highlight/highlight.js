import Highlight from '@tiptap/extension-highlight'
import { mergeAttributes } from '@tiptap/core'

export function useHighlight(options) {
	return Highlight.configure(options).extend({
		renderHTML: function ({ HTMLAttributes }) {
			const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
			if (attrs.color) {
				attrs.style = `background-color: ${attrs.color}`
			}
			return ['mark', attrs, 0]
		},
		addAttributes: function () {
			return {
				...this.parent?.(),
				// 添加新的属性
				color: {
					default: null,
					parseHTML: (element) => {
						return element.getAttribute('color')
					},
					renderHTML: (attributes) => ({
						'data-color': attributes.color,
						style: `background-color: ${attributes.color}`,
					}),
				},
			}
		},
	})
}
