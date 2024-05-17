import Italic from '@tiptap/extension-italic'
import ItalicExt from './Italic.vue'

export function useItalic(options) {
	return Italic.configure(options)
}

export { ItalicExt }
