import Underline, { UnderlineOptions } from "@tiptap/extension-underline";
import UnderlineExt from "./Underline.vue";

export function useUnderline(options?: Partial<UnderlineOptions>) {
	return Underline.configure(options);
}

export { UnderlineExt };
