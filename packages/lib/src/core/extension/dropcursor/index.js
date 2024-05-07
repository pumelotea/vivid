import Dropcursor from "@tiptap/extension-document";
import DropcursorExt from "./Dropcursor.vue";

export function useDropcursor(options){
	return Dropcursor.configure(options)
}

export {
	DropcursorExt
}
