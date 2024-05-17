import Focus from '@tiptap/extension-focus'
import FocusExt from './Focus.vue'

export function useFocus(options) {
	return Focus.configure(options)
}

export { FocusExt }
