import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style";
import TextStyleExt from "./TextStyle.vue";

export function useTextStyle(options?: Partial<TextStyleOptions>) {
	return TextStyle.configure(options);
}

export { TextStyleExt };
