import Strike from "@tiptap/extension-strike";
import StrikeExt from "./Strike.vue";

export function useStrike(options){
	return Strike.configure(options)
}

export {
	StrikeExt
}
