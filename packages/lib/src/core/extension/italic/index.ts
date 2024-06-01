import Italic, { ItalicOptions } from "@tiptap/extension-italic";
import ItalicExt from "./Italic.vue";

export function useItalic(options?: Partial<ItalicOptions>) {
	return Italic.configure(options);
}

export { ItalicExt };
