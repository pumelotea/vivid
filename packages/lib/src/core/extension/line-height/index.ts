import { Extension } from "@tiptap/core";
import { createLineHeightCommand } from "./utils";
import LineHeightExt from "./LineHeight.vue";

export interface LineHeightOptions {
	types: string[];
	lineHeights: string[];
	defaultHeight: string;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		lineHeight: {
			setLineHeight: (lineHeight: string) => ReturnType;
			unsetLineHeight: () => ReturnType;
		};
	}
}

export function useLineHeight() {
	return Extension.create<LineHeightOptions>({
		name: "lineHeight",
		addOptions() {
			return {
				...this.parent?.(),
				types: ["paragraph", "heading", "list_item", "todo_item"],
				lineHeights: ["100%", "115%", "150%", "200%", "250%", "300%"],
				defaultHeight: "100%",
			};
		},
		addGlobalAttributes() {
			return [
				{
					types: this.options.types,
					attributes: {
						lineHeight: {
							default: null,
							parseHTML: (element) => {
								return element.style.lineHeight || this.options.defaultHeight;
							},
							renderHTML: (attributes) => {
								if (
									attributes.lineHeight === this.options.defaultHeight ||
									!attributes.lineHeight
								) {
									return {};
								}
								return { style: `line-height: ${attributes.lineHeight}` };
							},
						},
					},
				},
			];
		},

		addCommands() {
			return {
				setLineHeight: (lineHeight) => createLineHeightCommand(lineHeight),
				unsetLineHeight:
					() =>
					({ commands }) => {
						return this.options.types.every((type) => commands.resetAttributes(type, "lineHeight"));
					},
			};
		},
	});
}

export { LineHeightExt };
