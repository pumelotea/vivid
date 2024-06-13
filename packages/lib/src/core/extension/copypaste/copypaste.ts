import { Extension, Range } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { DOMSerializer, Node } from "prosemirror-model";
import { UploadInfo } from "@lib/core/extension/types";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		copyPaste: {
			copyRange: (range: Range, node: Node) => ReturnType;
		};
	}
}

export function useCopyPaste() {
	return Extension.create({
		name: "handleCopyPaste",
		addCommands() {
			return {
				copyRange: (range: Range, node: Node) => {
					return ({ state, dispatch }) => {
						this.editor.chain().focus().setNodeSelection(range.from).run();
						const serializer = DOMSerializer.fromSchema(this.editor.schema);
						if (node) {
							const html = serializer.serializeNode(node);
							const div = document.createElement("div");
							div.append(html);
							navigator.clipboard.writeText(div.innerHTML);
							return true;
						}
						return false;
					};
				},
			};
		},
		addStorage() {
			return {};
		},
		addProseMirrorPlugins() {
			const editor = this.editor;
			const plugin = new Plugin({
				key: new PluginKey("handleCopyPaste"),
				props: {
					handlePaste: (view, event, p) => {
						function hasImageExt() {
							return editor.extensionManager.extensions.find((e) => e.name === "image");
						}

						function hasUploadManagerExt() {
							return editor.extensionManager.extensions.find((e) => e.name === "upload-manager");
						}

						const files = event.clipboardData!.files;
						const imageExt = hasImageExt();
						const uploadManagerExt = hasUploadManagerExt();
						if (uploadManagerExt && imageExt && files && files.length) {
							const fileList: UploadInfo[] = [];
							for (let i = 0; i < files.length; i++) {
								const file = files.item(i);
								if (!file) {
									continue;
								}
								if (!file.type.startsWith("image")) {
									continue;
								}
								fileList.push({
									file,
									pos: view.state.selection.from,
								});
							}
							editor.commands.upload(fileList);
							return true;
						}

						const html = event.clipboardData!.getData("text/html");
						if (html) {
							return false;
						}

						const text = event.clipboardData!.getData("text");
						if (!text) {
							return false;
						}
						return editor.commands.insertContent(text);
					},
				},
			});
			return [plugin];
		},
	});
}
