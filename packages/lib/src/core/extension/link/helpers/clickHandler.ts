import {getAttributes, getMarkRange} from '@tiptap/core'
import {MarkType} from '@tiptap/pm/model'
import {Plugin, PluginKey, TextSelection} from '@tiptap/pm/state'
import tippy, {Instance} from "tippy.js";
import editor from "@/editor";

type ClickHandlerOptions = {
  type: MarkType,
  whenNotEditable: boolean,
  element: HTMLElement,
  onShow: Function,
	onHide: Function
}

export function clickHandler(options: ClickHandlerOptions) {
  let tippyInstance: Instance

  return new Plugin({
    key: new PluginKey('handleClickLink'),
    props: {
      handleClick: (view, pos, event) => {
        if (tippyInstance) {
					options.onHide()
          tippyInstance.destroy()
        }
        if (options.whenNotEditable && view.editable) {
          return false
        }
        if (event.button !== 0) {
          return false
        }

        let a = event.target as HTMLElement
        const els = []

        while (a.nodeName !== 'DIV') {
          els.push(a)
          a = a.parentNode as HTMLElement
        }
        if (!els.find(value => value.nodeName === 'A')) {
          return false
        }
        const attrs = getAttributes(view.state, options.type.name)
        const link = (event.target as HTMLLinkElement)

        const href = link?.href ?? attrs.href
        const target = link?.target ?? attrs.target

        if (link && href && view.editable) {
          const rect = link.getBoundingClientRect()
          options.element.style.display = ''
          tippyInstance = tippy('body', {
            duration: 0,
            getReferenceClientRect: () => rect,
            content: options.element,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            hideOnClick: 'toggle',
          })[0]
          tippyInstance.show()
          const node = view.state.doc.nodeAt(pos)
          if (node){
            const linkNode = node.marks.filter(e=>e.type.name === 'link')
            if (linkNode.length){
              const { schema, doc, tr } = view.state
              const range = getMarkRange(doc.resolve(pos), schema.marks.link)
              if (!range) return false
              const $start = doc.resolve(range.from)
              const $end = doc.resolve(range.to)
              const transaction = tr.setSelection(new TextSelection($start, $end))
              view.dispatch(transaction)
              options.onShow(attrs,tippyInstance,linkNode[0], pos)
            }
          }


          return true
        }
        return false
      },
    },
  })
}
