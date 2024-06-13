import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import MathView from "./MathView.vue";

interface SetMathProps {
	tex: string;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		math: {
			setHbMath: (data: SetMathProps) => ReturnType;
		};
	}
}

export function useMath() {
	const node = Node.create({
		name: "hb-math",
		addOptions() {
			return {
				inline: true,
				HTMLAttributes: {},
			};
		},
		inline() {
			return this.options.inline;
		},

		group() {
			return this.options.inline ? "inline" : "block";
		},

		draggable: false,

		addAttributes() {
			return {
				tex: "",
			};
		},

		parseHTML() {
			return [
				{
					tag: "span[tex]",
				},
			];
		},

		renderHTML({ HTMLAttributes }) {
			return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
		},

		addCommands() {
			return {
				setHbMath:
					(options) =>
					({ commands }) => {
						return commands.insertContent({
							type: this.name,
							attrs: options,
						});
					},
			};
		},
	});
	return node.extend({
		addNodeView() {
			return VueNodeViewRenderer(MathView);
		},
	});
}
