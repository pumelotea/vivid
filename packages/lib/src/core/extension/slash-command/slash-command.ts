import { Editor, Extension } from "@tiptap/core";
import {PluginKey} from '@tiptap/pm/state'
import {Suggestion} from "@tiptap/suggestion";
import { SuggestionKeyDownProps, SuggestionOptions } from "@tiptap/suggestion/src/suggestion";
import { Ref, ref } from "vue";
import { Range } from "@tiptap/core";

export interface SlashCommandOptions {
  element: HTMLElement
}

export type SlashCommandData = {
  editor?: Editor
  query?: string
  range?: Range
}

export type SlashItemsQueryFn = (query: string)=> any[]
export type SlashRenderFn = SuggestionOptions['render']
export type SlashCommandKeyDownFn = (props: SuggestionKeyDownProps) => boolean

let itemsFn: SlashItemsQueryFn
let renderFn: SlashRenderFn | undefined = undefined
export let keyDownFn: SlashCommandKeyDownFn

export function overwriteItems(fn: SlashItemsQueryFn){
  itemsFn = fn
}

export function overwriteRender(fn: SlashRenderFn){
  renderFn = fn
}

export function overwriteKeyDown(fn: SlashCommandKeyDownFn){
	keyDownFn = fn
}

const data: Ref<SlashCommandData> = ref({})
export function useSlashCommandData(){
  return data
}

export function useSlashCommand(options?: Partial<SlashCommandOptions>){

  return Extension.create<SlashCommandOptions>({
    addProseMirrorPlugins(){
      const plugin = Suggestion({
        editor: this.editor,
        char: '/',
        allowSpaces: false,
        startOfLine: true,
        pluginKey: new PluginKey('slashCommand'),
        allow: ({state, range, editor}) => {
          const $from = state.doc.resolve(range.from)
          const isRootDepth = $from.depth === 1
          const isParagraph = $from.parent.type.name === 'paragraph'
          const isStartOfNode = $from.parent.textContent?.charAt(0) === '/'
          // TODO 行列内
          const isInColumn = editor.isActive('column')
          const afterContent = $from.parent.textContent?.substring($from.parent.textContent?.indexOf('/'))
          const isValidAfterContent = !afterContent?.endsWith('  ')
          return (
            ((isRootDepth && isParagraph && isStartOfNode) || (isInColumn && isParagraph && isStartOfNode)) &&
            isValidAfterContent
          )
        },
        items: ({query, editor}) => {
          if (itemsFn){
            return itemsFn(query)
          }
          return []
        },
        render() {
          if (renderFn){
            return renderFn() || {}
          }
          return {}
        }
      })
      return [plugin]
    }
  })
}


