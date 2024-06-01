import {Editor, Node} from "@tiptap/core";
import {inject, ShallowRef} from "vue"
import {Extension} from '@tiptap/core'

/**
 * 在编辑器内部组件提供注入实例的hook
 */
export function useEditorInstance() {
  return inject('editorInstance') as ShallowRef<Editor>
}

/**
 * 在编辑器内部组件提供注入扩展的hook
 */
export function injectExtension(extension: Extension | Node) {
  const useExtension = inject('useExtension') as (ext: Extension | Node) => void
  useExtension(extension)
}

export function uninjectExtension(extName: string) {
  const removeExtension = inject('removeExtension') as (extName: string) => void
  removeExtension(extName)
}
