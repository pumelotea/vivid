import Color from '@tiptap/extension-color'
import ColorExt from './Color.vue'

export function useColor(options) {
	return Color.configure(options)
}

export { ColorExt }
