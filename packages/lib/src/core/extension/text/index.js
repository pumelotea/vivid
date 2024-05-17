import Text from '@tiptap/extension-text'
import TextExt from './Text.vue'

export function useText(options) {
	return Text.configure(options)
}

export { TextExt }
