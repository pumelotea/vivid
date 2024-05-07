import Subscript from "@tiptap/extension-subscript";
import SubscriptExt from './Subscript.vue'
export function useSubscript(options){
	return Subscript.configure(options)
}

export {
	SubscriptExt
}
