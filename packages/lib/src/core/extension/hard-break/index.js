import HardBreak from "@tiptap/extension-hard-break";
import HardBreakExt from "./HardBreak.vue";

export function useHardBreak(options){
	return HardBreak.configure(options)
}


export {
	HardBreakExt
}
