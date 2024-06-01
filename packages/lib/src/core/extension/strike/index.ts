import Strike, { StrikeOptions } from "@tiptap/extension-strike";
import StrikeExt from "./Strike.vue";

export function useStrike(options?: Partial<StrikeOptions>) {
	return Strike.configure(options);
}

export { StrikeExt };
