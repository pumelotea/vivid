import TextStyle from '@tiptap/extension-text-style'
import TextStyleExt from './TextStyle.vue'

export function useTextStyle(options) {
	return TextStyle.configure(options)
}

export { TextStyleExt }
