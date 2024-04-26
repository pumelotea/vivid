import TextAlign from "@tiptap/extension-text-align";


export function useTextAlign(options){
	if (!options){
		options = {
			types: [ 'heading', 'paragraph' ]
		}
	}
	return TextAlign.configure(options)
}
