import Placeholder from '@tiptap/extension-placeholder'

export function usePlaceholder(options) {
	if (!options) {
		options = {
			// Use a placeholder:
			placeholder: '写点有意思的内容...',
			// Use different placeholders depending on the node type:
			// placeholder: ({ node }) => {
			//   if (node.type.name === 'heading') {
			//     return 'What’s the title?'
			//   }

			//   return 'Can you add some further context?'
			// },
		}
	}
	return Placeholder.configure(options)
}
