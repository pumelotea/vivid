import CharacterCount from "@tiptap/extension-character-count";
import CharacterCountExt from "./CharacterCount.vue";

export function useCharacterCount(options){
	return CharacterCount.configure(options)
}

export {
	CharacterCountExt
}
