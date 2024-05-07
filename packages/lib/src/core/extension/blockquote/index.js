import Blockquote from "@tiptap/extension-blockquote";
import BlockQuoteExt from './BlockQuote.vue'
export function useBlockquote(options){
	return Blockquote.configure(options)
}

export {
	BlockQuoteExt
}
