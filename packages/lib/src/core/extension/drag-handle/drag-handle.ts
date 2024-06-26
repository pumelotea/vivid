import { Editor, Extension, Range } from "@tiptap/core";
import tippy, { Instance } from "tippy.js";
import { Ref, ref } from "vue";
import { Node } from "prosemirror-model";

export interface DragHandleOptions {
	element: HTMLElement;
	debug?: boolean;
}

export type DragHandleData = {
	editor?: Editor;
	node: Node | null;
	nodeDOM?: HTMLElement;
	rect?: DOMRect;
	preRange?: Range;
	range?: Range;
	nextRange?: Range;
};

let keepCurrentPos = false;
const data: Ref<DragHandleData> = ref({
	node: null,
});

export function lockDragHandle() {
	keepCurrentPos = true;
}

export function unlockDragHandle() {
	keepCurrentPos = false;
}

export function useDragHandleData() {
	return data;
}

export function useDragHandle(options: DragHandleOptions) {
	let mouseEvent: MouseEvent;
	let tippyInstance: Instance;
	let currentDom: Element;
	let editor: Editor;

	const box = document.createElement("div");
	box.style.pointerEvents = "none";
	document.body.append(box);

	function drawBox(rect: any) {
		if (!currentDom) {
			return;
		}
		const div = document.createElement("div");
		div.style.width = `${rect.width}px`;
		div.style.height = `${rect.height}px`;
		div.style.left = `${rect.left}px`;
		div.style.top = `${rect.top}px`;
		div.style.marginLeft = "0";
		div.style.marginRight = "0";
		div.style.position = "fixed";
		div.style.border = "1px solid";
		div.style.pointerEvents = "none";
		box.append(div);
	}

	function getBoundingClientRect(dom: Element) {
		const rect = dom.getBoundingClientRect();
		// 获取元素的边距
		const computedStyle = window.getComputedStyle(dom)
		const marginLeft = parseFloat(computedStyle.marginLeft);
		const marginTop = parseFloat(computedStyle.marginTop);
		const marginBottom = parseFloat(computedStyle.marginBottom);
		const marginRight = parseFloat(computedStyle.marginRight);
		// 计算包含边距的宽度和高度
		const width = rect.width + marginLeft + marginRight;
		const height = rect.height + marginTop + marginBottom;

		const isTable = dom.classList.contains("tableWrapper");

		const res = {
			top: rect.top - marginTop,
			width: rect.width,
			height: height,
			left: rect.left,
			x: rect.x,
			y: rect.y - marginTop,
			bottom: rect.bottom + marginBottom,
			right: rect.right,
		};

		if (isTable) {
			res.right += 10;
			res.width += 10;
		} else {
			res.left -= 10;
			res.right += 10;
			res.width += 20;
		}
		return res;
	}

	function getHoverRect(dom: Element) {
		box.innerHTML = "";
		let index = 0;
		const wrapRect = dom.getBoundingClientRect();

		for (let child of dom.children) {
			const rect = getBoundingClientRect(child);
			const checkRect = {
				...rect,
			};
			checkRect.left = wrapRect.left;
			checkRect.right = wrapRect.right;
			checkRect.width = wrapRect.width;
			checkRect.top = rect.top;
			checkRect.height = rect.height;

			if (isMouseInsideElement(checkRect)) {
				currentDom = child;
				if (options.debug) {
					drawBox(rect);
				}
				const range = getRange(child);
				const preRange = getRange(dom.children[index - 1]);
				const nextRange = getRange(dom.children[index + 1]);
				return {
					rect,
					preRange,
					range,
					nextRange,
				};
			}
			index += 1;
		}
	}

	function isMouseInsideElement(rect: any) {
		if (!mouseEvent) {
			return false;
		}
		const mouseX = mouseEvent.clientX;
		const mouseY = mouseEvent.clientY;
		return (
			mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom
		);
	}

	function getRange(dom: Element): Range | undefined {
		if (!dom) {
			return undefined;
		}

		if (dom.tagName === "HR") {
			const from = editor.view.posAtDOM(dom, 0);
			const to = from + 1;
			return {
				from,
				to,
			};
		}

		const from = editor.view.posAtDOM(dom, 0) - 1;
		const node = editor.state.doc.nodeAt(from)!;
		const to = node.nodeSize + from;
		return {
			from,
			to,
		};
	}

	function render(dom: Element) {
		if (!editor.isEditable) {
			tippyInstance.hide();
			return;
		}
		if (keepCurrentPos) {
			return;
		}
		const pos = getHoverRect(dom);
		if (pos) {
			data.value.editor = editor;
			data.value.nodeDOM = currentDom as HTMLElement;
			data.value.rect = pos.rect as DOMRect;
			data.value.range = pos.range;
			data.value.preRange = pos.preRange;
			data.value.nextRange = pos.nextRange;
			if (pos.range) {
				data.value.node = editor.state.doc.nodeAt(pos.range.from) as Node | null;
			}
			tippyInstance.setProps({
				getReferenceClientRect: () => {
					return pos.rect as DOMRect;
				},
			});
			tippyInstance.show();
		} else {
			tippyInstance.hide();
		}
	}

	return Extension.create({
		name: "dragHandle",
		onCreate() {
			editor = this.editor;
			const dom = this.editor.view.dom;
			// 创建弹出层
			// @ts-ignore
			tippyInstance = tippy("body", {
				duration: 0,
				getReferenceClientRect: null,
				content: options.element,
				interactive: true,
				trigger: "manual",
				appendTo: dom.parentNode,
				placement: "left-start",
				hideOnClick: "toggle",
			})[0];
			dom.parentNode!.addEventListener("scroll", () => {
				render(dom);
			});
			dom.addEventListener("mousemove", (e) => {
				mouseEvent = e;
				render(dom);
			});
			render(dom);
		},
		onUpdate() {
			const dom = this.editor.view.dom;
			render(dom);
		},
		onDestroy() {
			tippyInstance?.destroy();
		},
	});
}
