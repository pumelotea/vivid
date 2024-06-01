import Subscript, { SubscriptExtensionOptions } from "@tiptap/extension-subscript";
import SubscriptExt from "./Subscript.vue";

export function useSubscript(options?: Partial<SubscriptExtensionOptions>) {
	return Subscript.configure(options);
}

export { SubscriptExt };
