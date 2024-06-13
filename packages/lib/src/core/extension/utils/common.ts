import { Editor, Mark, Node } from "@tiptap/core";
import { inject, ShallowRef } from "vue";
import { Extension } from "@tiptap/core";
import { watchOnce } from "@vueuse/core";

/**
 * 在编辑器内部组件提供注入实例的hook
 */
export function useEditorInstance() {
	return inject("editorInstance") as ShallowRef<Editor>;
}

/**
 * 在编辑器内部组件提供注入扩展的hook
 */
export function injectExtension(extension: Extension | Node | Mark) {
	const useExtension = inject("useExtension") as (ext: Extension | Node | Mark) => void;
	useExtension(extension);
}

export function uninjectExtension(extName: string) {
	const removeExtension = inject("removeExtension") as (extName: string) => void;
	removeExtension(extName);
}

export function onEditorCreated(fn: () => void) {
	const instance = useEditorInstance();
	watchOnce(instance, () => {
		fn();
	});
	return instance;
}
