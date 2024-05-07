import Paragraph from "@tiptap/extension-paragraph";
import ParagraphExt from './Paragraph.vue'

export function useParagraph(options){
	return Paragraph.configure(options)
}

export {
	ParagraphExt
}
