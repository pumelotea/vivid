import Paragraph, { ParagraphOptions } from "@tiptap/extension-paragraph";
import ParagraphExt from "./Paragraph.vue";

export function useParagraph(options?: Partial<ParagraphOptions>) {
	return Paragraph.configure(options);
}

export { ParagraphExt };
