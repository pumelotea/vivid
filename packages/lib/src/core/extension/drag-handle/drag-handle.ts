import {Editor, Extension} from '@tiptap/core';
import tippy, {Instance} from 'tippy.js'


export function useDragHandle(options: any) {
  let mouseEvent: any
  let tippyInstance: Instance
  let currentDom: Element
  let editor: Editor

  const box = document.createElement('div')
  box.style.pointerEvents = 'none'
  document.body.append(box)

  function drawBox(rect: any) {
    if (!currentDom) {
      return
    }
    const div = document.createElement('div')
    div.style.width = `${rect.width}px`
    div.style.height = `${rect.height}px`
    div.style.left = `${rect.left}px`
    div.style.top = `${rect.top}px`
    div.style.marginLeft = '0'
    div.style.marginRight = '0'
    div.style.position = 'fixed'
    div.style.border = '1px solid'
    div.style.pointerEvents = 'none'
    box.append(div)
  }

  function getBoundingClientRect(dom: Element){
    const rect = dom.getBoundingClientRect()
    // 获取元素的边距
    const marginLeft = parseFloat(window.getComputedStyle(dom).marginLeft);
    const marginTop = parseFloat(window.getComputedStyle(dom).marginTop);
    const marginBottom = parseFloat(window.getComputedStyle(dom).marginBottom);
    const marginRight = parseFloat(window.getComputedStyle(dom).marginRight);
    // 计算包含边距的宽度和高度
    const width = rect.width + marginLeft + marginRight;
    const height = rect.height + marginTop + marginBottom;


    const isTable = dom.classList.contains('vivid-table')

    const res = {
      top: rect.top - marginTop,
      width: rect.width,
      height: height,
      left: rect.left,
      x: rect.x,
      y: rect.y - marginTop,
      bottom: rect.bottom + marginBottom,
      right: rect.right,
    }

    if (isTable) {
      res.right += 15
      res.width += 15
    }else{
      res.left -= 15
      res.right += 15
      res.width += 30
    }
    return res
  }

  function getHoverRect(dom: Element) {
    box.innerHTML = ''
    let index = 0
    const wrapRect = dom.getBoundingClientRect()

    for (let child of dom.children) {
      const rect = getBoundingClientRect(child)
      const checkRect = {
        ...rect
      }
      checkRect.left = wrapRect.left
      checkRect.right = wrapRect.right
      checkRect.width = wrapRect.width
      checkRect.top = rect.top
      checkRect.height = rect.height

      if (isMouseInsideElement(checkRect)) {
        currentDom = child
        // drawBox(rect)
        const range = getRange(child)
        const preRange = getRange(dom.children[index - 1])
        const nextRange = getRange(dom.children[index + 1])
        return {
          rect,
          preRange,
          range,
          nextRange
        }
      }
      index += 1
    }
  }

  function isMouseInsideElement(rect: any) {
    if (!mouseEvent) {
      return false
    }
    const mouseX = mouseEvent.clientX;
    const mouseY = mouseEvent.clientY;
    return (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    );
  }

  function getRange(dom: Element) {
    if (!dom) {
      return null
    }

    if (dom.tagName === 'HR'){
      const from = editor.view.posAtDOM(dom, 0)
      const to = from + 1
      return {
        from,
        to
      }
    }

    const from = editor.view.posAtDOM(dom, 0) - 1
    const node = editor.state.doc.nodeAt(from)!
    const to = node.nodeSize + from
    return {
      from,
      to
    }
  }

  function render(dom: Element) {
    const pos = getHoverRect(dom)
    if (pos) {
      options.update && options.update(editor, pos, currentDom)
      tippyInstance.setProps({
        getReferenceClientRect: () => {
          return pos.rect as any
        }
      })
      tippyInstance.show()
    } else {
      tippyInstance.hide()
    }
  }

  const DragHandleExtension = Extension.create({
    name: 'dragHandle',
    onCreate() {
      editor = this.editor
      const dom = this.editor.view.dom
      // 创建弹出层
      tippyInstance = tippy('body', {
        duration: 0,
        getReferenceClientRect: null,
        content: options.element,
        interactive: true,
        trigger: 'manual',
        placement: 'left-start',
        hideOnClick: 'toggle',
      })[0]
      options.element.style.display = 'flex'
      render(dom)
      dom.parentNode!.addEventListener('scroll', () => {
        render(dom)
      })
      dom.addEventListener('mousemove', e => {
        mouseEvent = e
        render(dom)
      })
    },
    onUpdate() {
      const dom = this.editor.view.dom
      render(dom)
    },
    onDestroy() {
      tippyInstance?.destroy()
    }
  })
  return {
    DragHandleExtension,
  }
}

