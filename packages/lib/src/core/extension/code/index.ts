import Code, { CodeOptions } from "@tiptap/extension-code";
import CodeExt from "./Code.vue";

export function useCode(options?: Partial<CodeOptions>) {
	return Code.configure(options);
}

export { CodeExt };
