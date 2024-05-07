import Document from "@tiptap/extension-document";
import DocumentExt from "./Document.vue";

export function useDocument(options){
	return Document.configure(options)
}

export {
	DocumentExt
}
