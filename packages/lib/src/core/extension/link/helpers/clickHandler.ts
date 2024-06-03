import { MarkType, DOMParser as TipTapDOMParser ,DOMSerializer } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { EditorView } from "prosemirror-view";

type ClickHandlerOptions = {
	type: MarkType,
	handleClick?: (view: EditorView, pos: number, event: MouseEvent, type: MarkType) => boolean,
	handleKeyDown?: () => boolean
}

export function clickHandler(options: ClickHandlerOptions) {
	return new Plugin({
		key: new PluginKey("handleClickLink"),
		props: {
			handleClick: (view, pos, event) => {
				if (options.handleClick) {
					return options.handleClick(view, pos, event, options.type);
				}
				return false;
			},
			// 处理粘贴
			// handlePaste: (view, event, p)=>{
			// 	const htmlText = event.clipboardData!.getData('text')
			// 	var parser2 = new DOMParser();
			// 	var doc = parser2.parseFromString(htmlText, "text/html");
			// 	const from = view.state.selection.from - 1
			// 	console.log(view.state.schema)
			// 	const parser = new TipTapDOMParser(view.state.schema , [])
			//   const node = parser.parse(doc.body.firstChild!)
			// 	console.log(node.content)
			//
			// 	const tr = view.state.tr
			//
			// 	tr.insert(from ,node.content)
			//
			// 	view.dispatch(tr)
			//
			// 	return true
			// },
			handleKeyDown: () => {
				if (options.handleKeyDown) {
					return options.handleKeyDown();
				}
				return false;
			},
		},
	});
}
