import { MarkType } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { EditorView } from "prosemirror-view";

type ClickHandlerOptions = {
	type: MarkType;
	handleClick?: (view: EditorView, pos: number, event: MouseEvent, type: MarkType) => boolean;
	handleKeyDown?: () => boolean;
};

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
			handleKeyDown: () => {
				if (options.handleKeyDown) {
					return options.handleKeyDown();
				}
				return false;
			},
		},
	});
}
