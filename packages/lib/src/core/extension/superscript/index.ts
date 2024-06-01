import Superscript, { SuperscriptExtensionOptions } from "@tiptap/extension-superscript";
import SuperscriptExt from "./Superscript.vue";

export function useSuperscript(options?: Partial<SuperscriptExtensionOptions>) {
	return Superscript.configure(options);
}

export { SuperscriptExt };
