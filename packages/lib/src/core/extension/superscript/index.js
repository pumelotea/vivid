import Superscript from '@tiptap/extension-superscript'
import SuperscriptExt from './Superscript.vue'

export function useSuperscript(options) {
	return Superscript.configure(options)
}

export { SuperscriptExt }
