import { Editor, Extension, isList } from "@tiptap/core";
import { TextSelection, AllSelection, Transaction } from "@tiptap/pm/state";

export interface IndentOptions {
	types: string[];
	minIndent: number;
	maxIndent: number;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		indent: {
			/**
			 * Set the indent attribute
			 */
			indent: () => ReturnType;
			/**
			 * Set the outdent attribute
			 */
			outdent: () => ReturnType;
		};
	}
}

function clamp(val: number, min: number, max: number): number {
	if (val < min) {
		return min;
	}
	if (val > max) {
		return max;
	}
	return val;
}

function updateIndentLevel(tr: Transaction, delta: number, types: string[], editor: Editor) {
	const { doc, selection } = tr;

	if (!doc || !selection) return tr;

	if (!(selection instanceof TextSelection || selection instanceof AllSelection)) {
		return tr;
	}

	const { from, to } = selection;

	doc.nodesBetween(from, to, (node, pos) => {
		const nodeType = node.type;

		if (types.includes(nodeType.name)) {
			tr = setNodeIndentMarkup(tr, pos, delta);
			return false;
		} else if (isList(node.type.name, editor.extensionManager.extensions)) {
			return false;
		}
		return true;
	});

	return tr;
}

function setNodeIndentMarkup(tr: Transaction, pos: number, delta: number) {
	if (!tr.doc) return tr;

	const node = tr.doc.nodeAt(pos);
	if (!node) return tr;

	const minIndent = 0;
	const maxIndent = 7;

	const indent = clamp((node.attrs.indent || 0) + delta, minIndent, maxIndent);

	if (indent === node.attrs.indent) return tr;

	const nodeAttrs = {
		...node.attrs,
		indent,
	};

	return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
}

function createIndentCommand({ delta, types }: { delta: number; types: string[] }) {
	return ({ state, dispatch, editor }) => {
		const { selection } = state;
		let { tr } = state;
		tr = tr.setSelection(selection);
		tr = updateIndentLevel(tr, delta, types, editor);

		if (tr.docChanged) {
			dispatch && dispatch(tr);
			return true;
		}

		return false;
	};
}

export function useIndent(options?: Partial<IndentOptions>) {
	return Extension.create({
		name: "indent",
		addOptions() {
			return {
				types: ["paragraph", "heading"],
				minIndent: 0,
				maxIndent: 7,
				...options,
			};
		},

		addGlobalAttributes() {
			return [
				{
					types: this.options.types,
					attributes: {
						indent: {
							default: 0,
							parseHTML: (element) => {
								const identAttr = element.getAttribute("data-indent");
								return (identAttr ? parseInt(identAttr, 10) : 0) || 0;
							},
							renderHTML: (attributes) => {
								if (!attributes.indent) {
									return {};
								}

								return { "data-indent": attributes.indent };
							},
						},
					},
				},
			];
		},

		addCommands() {
			return {
				indent: () =>
					createIndentCommand({
						delta: 1,
						types: this.options.types,
					}),
				outdent: () =>
					createIndentCommand({
						delta: -1,
						types: this.options.types,
					}),
			};
		},

		addKeyboardShortcuts() {
			return {
				Tab: () => this.editor.commands.indent(),
				"Shift-Tab": () => this.editor.commands.outdent(),
			};
		},
	});
}
