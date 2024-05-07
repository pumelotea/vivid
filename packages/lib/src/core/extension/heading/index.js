import Heading from "@tiptap/extension-heading";
import HeadingExt from "./Heading.vue";

export function useHeading(options){
	return Heading.configure(options)
}

export {
	HeadingExt
}
