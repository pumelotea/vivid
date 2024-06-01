import Dropcursor, { DropcursorOptions } from "@tiptap/extension-dropcursor";
import DropcursorExt from "./Dropcursor.vue";

export function useDropcursor(options?: Partial<DropcursorOptions>) {
  return Dropcursor.configure(options);
}

export { DropcursorExt };
