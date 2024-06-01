import CharacterCount, { CharacterCountOptions } from "@tiptap/extension-character-count";
import CharacterCountExt from "./CharacterCount.vue";

export function useCharacterCount(options?: Partial<CharacterCountOptions>) {
	return CharacterCount.configure(options);
}

export { CharacterCountExt };
