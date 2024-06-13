import Heading, { HeadingOptions } from "@tiptap/extension-heading";
import HeadingExt from "./Heading.vue";

export function useHeading(options?: Partial<HeadingOptions>) {
	return Heading.configure(options);
}

export { HeadingExt };
