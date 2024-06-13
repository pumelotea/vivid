import Placeholder, { PlaceholderOptions } from "@tiptap/extension-placeholder";

export function usePlaceholder(options?: Partial<PlaceholderOptions>) {
	if (!options) {
		options = {
			placeholder: ({ node, pos }) => {
				if (node?.type?.name === "heading") {
					return `标题${node.attrs.level}`;
				}
				if (node?.type?.name === "codeBlock") {
					return "";
				}
				if (pos === 0) {
					return "请输入正文";
				}
				return `输入 '/' 唤起更多`;
			},
		};
	}
	return Placeholder.configure(options);
}
