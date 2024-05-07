import Bold from "@tiptap/extension-bold";
import BoldExt from './Bold.vue'

export function useBold(options){
	return Bold.configure(options)
}

export {
	BoldExt
}
