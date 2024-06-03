import Link, { LinkOptions } from "@tiptap/extension-link";
import { clickHandler } from "./helpers/clickHandler";
import { EditorView } from "prosemirror-view";
import { MarkType } from "@tiptap/pm/model";

export interface VividLinkOptions extends LinkOptions {
	handleClick: (view: EditorView, pos: number, event: MouseEvent, type: MarkType) => boolean;
	handleKeyDown?: () => boolean
}

export function useLink(options: Partial<VividLinkOptions>) {
	return Link.extend({
		addProseMirrorPlugins() {
			const parentPlugins = this.parent!().filter(e => {
				// @ts-ignore
				return !(e.spec.key.key).startsWith("handleClickLink");
			});

			if (this.options.openOnClick) {
				parentPlugins.push(
					clickHandler({
						type: this.type,
						handleClick: options.handleClick,
						handleKeyDown: options.handleKeyDown,
					}),
				);
			}
			return parentPlugins;
		},
	}).configure(options);
}
