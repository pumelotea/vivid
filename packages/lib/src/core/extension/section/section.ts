import { Node } from "@tiptap/core";

export function useSection() {
	return Node.create({
		name: "section",
		group: "block",
		content: "block+",

		addAttributes() {
			return {
				style: {
					default: null,
					parseHTML: (element) => element.getAttribute("style"),
					renderHTML: (attributes) => ({ style: attributes.style }),
				},
			};
		},

		parseHTML() {
			return [{ tag: "section" }];
		},

		renderHTML({ HTMLAttributes }) {
			return ["section", HTMLAttributes, 0];
		},
	});
}
