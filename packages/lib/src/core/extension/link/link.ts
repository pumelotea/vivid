import Link from '@tiptap/extension-link'
import {autolink} from './helpers/autolink'
import {clickHandler} from './helpers/clickHandler'
import {pasteHandler} from './helpers/pasteHandler'

export function useLink(element: HTMLElement,onShow:Function, onHide:Function, options: any) {
  if (!options) {
    options = {
      protocols: ['ftp', 'mailto', 'http', 'https'],
      autolink: false,
    }
  }
  return Link.extend({
    addProseMirrorPlugins() {

      const plugins = []

      if (this.options.autolink) {
        plugins.push(
          autolink({
            type: this.type,
            validate: this.options.validate,
          }),
        )
      }

      if (this.options.openOnClick) {
        plugins.push(
					clickHandler({
						type: this.type,
						// @ts-ignore
						whenNotEditable: this.options.openOnClick === 'whenNotEditable',
						element,
            onShow,
						onHide
					})
        )
      }

      if (this.options.linkOnPaste) {
        plugins.push(
          pasteHandler({
            editor: this.editor,
            type: this.type,
          }),
        )
      }

      return plugins
    }
  }).configure(options)
}
