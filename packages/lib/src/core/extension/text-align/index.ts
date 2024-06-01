import TextAlign, { TextAlignOptions } from "@tiptap/extension-text-align";
import TextAlignExt from "./TextAlign.vue";

export function useTextAlign(options?: Partial<TextAlignOptions>) {
	if (!options) {
		options = {
			types: ["heading", "paragraph"],
		};
	}
	return TextAlign.configure(options);
}

export { TextAlignExt };
