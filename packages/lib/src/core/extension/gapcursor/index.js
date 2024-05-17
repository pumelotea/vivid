import Gapcursor from '@tiptap/extension-gapcursor'
import GapcursorExt from './Gapcursor.vue'

export function useGapcursor(options) {
	return Gapcursor.configure(options)
}

export { GapcursorExt }
