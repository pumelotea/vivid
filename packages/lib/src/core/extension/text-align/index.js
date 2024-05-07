import TextAlign from "@tiptap/extension-text-align";
import TextAlignExt from './TextAlign.vue'

export function useTextAlign(options){
	if (!options){
		options = {
			types: [ 'heading', 'paragraph' ]
		}
	}
	return TextAlign.configure(options)
}

export {
	TextAlignExt
}
