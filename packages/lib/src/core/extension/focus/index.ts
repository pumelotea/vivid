import Focus, { FocusOptions } from "@tiptap/extension-focus";
import FocusExt from "./Focus.vue";

export function useFocus(options?: Partial<FocusOptions>) {
  return Focus.configure(options);
}

export { FocusExt };
