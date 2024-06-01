import Color, { ColorOptions } from "@tiptap/extension-color";
import ColorExt from "./Color.vue";

export function useColor(options?: Partial<ColorOptions>) {
	return Color.configure(options);
}

export { ColorExt };
