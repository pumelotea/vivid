import Code from '@tiptap/extension-code'
import CodeExt from './Code.vue'

export function useCode(options) {
	return Code.configure(options)
}

export { CodeExt }
