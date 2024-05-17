import Underline from '@tiptap/extension-underline'
import UnderlineExt from './Underline.vue'

export function useUnderline(options) {
	return Underline.configure(options)
}

export { UnderlineExt }
