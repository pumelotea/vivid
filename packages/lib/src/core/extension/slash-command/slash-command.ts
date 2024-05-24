import { Editor } from '@tiptap/core'
import {PluginKey} from '@tiptap/pm/state'
import tippy from 'tippy.js'
import {Suggestion} from "@tiptap/suggestion";


export interface SlashCommandPluginProps {
  editor: Editor
  element: HTMLElement
  onQuery: (query: string) => void
  updateRange: (r: any) => void
  onKeyDown: (e: any) => boolean
}

export const SlashCommandSuggestPlugin = (options: SlashCommandPluginProps) => {
  return Suggestion({
    editor: options.editor,
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
      options.onQuery(query)
      return []
    },
    render() {
      const tippyInstance = tippy('body', {
        duration: 0,
        getReferenceClientRect: null,
        content: options.element,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
        hideOnClick: 'toggle',
      })[0]
      return {
        onStart: (props) => {
          const {view, state} = props.editor
          tippyInstance.setProps({
            getReferenceClientRect: () => {
              return props.clientRect!() as DOMRect
            }
          })
          options.updateRange(props.range)
          tippyInstance.show()
        },
        onUpdate: (props) => {
          const {view, state} = props.editor
          options.updateRange(props.range)
          tippyInstance.setProps({
            getReferenceClientRect: () => {
              return props.clientRect!() as DOMRect
            }
          })
        },
        onKeyDown: (props) => {
          if (props.event.key === 'Escape') {
            tippyInstance.hide()
            return true
          }

          if (!tippyInstance.state.isShown) {
            tippyInstance.show()
          }

          return options.onKeyDown&&options.onKeyDown(props.event)
        },
        onExit: () => {
          options.onQuery('')
          options.updateRange(null)
          tippyInstance.hide()
        }
      }
    }
  })
}
