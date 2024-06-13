<script setup lang="ts">
	import "remixicon/fonts/remixicon.css";
	import "../style/index.css";
	import "../style/table.scss";

	import { computed, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from "vue";
	import { useThemeVars } from "naive-ui";
	import { EditorContent, BubbleMenu, EditorOptions } from "@tiptap/vue-3";
	import { useDebounceFn } from "@vueuse/core";
	import { NMessageProvider, NDialogProvider } from "naive-ui";

	import VividMenu from "./components/VividMenu.vue";
	import VividBubbleMenu from "./components/VividBubbleMenu.vue";
	import VividFooter from "./components/VividFooter.vue";
	import { Editor } from "@tiptap/vue-3";
	import { CellSelection } from "prosemirror-tables";
	import { TextSelection } from "@tiptap/pm/state";
	import { Extension, Mark, Node } from "@tiptap/core";

	const vars = useThemeVars();

	const props = defineProps({
		page: {
			type: Boolean,
			default: false,
		},
		dark: {
			type: Boolean,
			default: false,
		},
		bubbleMenu: {
			type: Boolean,
			default: true,
		},
		modelValue: {
			type: String,
			default: "",
		},
		to: {
			type: String,
			required: false,
			default: "",
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	});

	let internalExt: (Extension | Node | Mark)[] = [];
	const editor = shallowRef<Editor>();
	const words = ref(0);
	const characters = ref(0);
	const fullscreen = ref(false);
	const editorBox = ref<any>(null);
	const editorBoxParent = ref<any>(null);
	const isFocused = ref(false);

	const emit = defineEmits(["update:modelValue", "change"]);

	provide("useExtension", useExtension);
	provide("removeExtension", removeExtension);
	provide("editorInstance", editor);

	const updateEditorWordCount = useDebounceFn(() => {
		words.value = editor.value?.storage.characterCount.words() || 0;
		characters.value = editor.value?.storage.characterCount.characters() || 0;
	}, 300);

	function useExtension(ext: Extension | Node | Mark) {
		if (internalExt.filter((e) => e === ext).length) {
			return;
		}
		internalExt.push(ext);
	}

	function removeExtension(extName: string) {
		const index = internalExt.findIndex((e) => e.name === extName);
		if (index > -1) {
			internalExt.splice(index, 1);
		}
	}

	function initEditor() {
		const opt: Partial<EditorOptions> = {
			content: props.modelValue,
			editable: !props.readonly,
			extensions: internalExt,
			onUpdate: ({ editor }) => {
				// HTML
				emit("update:modelValue", editor.getHTML());

				// JSON
				// this.$emit('update:modelValue', this.editor.getJSON())

				updateEditorWordCount();
			},
			onFocus: () => {
				isFocused.value = true;
			},
			onBlur: () => {
				isFocused.value = false;
			},
			onSelectionUpdate: ({ editor }) => {},
		};
		editor.value = new Editor(opt);
		editor.value.storage.fullscreen = fullscreen;
		emit("update:modelValue", editor.value.getHTML());
		emit("change", editor.value.getHTML());
		updateEditorWordCount();
	}

	onMounted(() => {
		initEditor();
	});

	watch(
		() => props.readonly,
		(value) => {
			if (editor.value) {
				editor.value.setEditable(!value);
			}
		},
	);

	watch(
		() => props.modelValue,
		(value) => {
			if (!editor.value) {
				return;
			}
			// HTML
			const isSame = editor.value.getHTML() === value;

			// JSON
			// const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

			if (isSame) {
				return;
			}

			editor.value.commands.setContent(value, false);
		},
	);

	watch(fullscreen, () => {
		if (fullscreen.value === true) {
			if (props.to) {
				editorBoxParent.value = editorBox.value.parentNode;
				const to = document.getElementById(props.to);
				if (to) {
					to.append(editorBox.value);
				}
			}
		} else {
			if (props.to) {
				editorBoxParent.value.append(editorBox.value);
			}
		}
	});

	onBeforeUnmount(() => {
		editor.value?.destroy();
	});

	function tab(e) {
		if (e.keyCode === 9) {
			e.preventDefault();
		}
	}

	const hideBubble = ref(false);
	const nodeType = computed<string | undefined>(() => {
		if (!editor.value) {
			return undefined;
		}
		const selection = editor.value.state.selection as any;
		const isImage = selection.node?.type.name === "image";
		const isVideo = selection.node?.type.name === "video";
		const isMagic = selection.node?.type.name === "magic";
		const isMath = selection.node?.type.name === "hb-math";
		const isCodeBlock = selection.$anchor.parent.type.name === "codeBlock";
		const isCell = selection instanceof CellSelection;
		const isTable = selection.node?.type.name === "table" || isCell; // 选中表格或者单元格
		const isText = selection instanceof TextSelection;
		if (isImage) return "image";
		if (isVideo) return "video";
		if (isTable) return "table";
		if (isMagic) return "magic";
		if (isMath) return "math";
		if (isCodeBlock) return "codeBlock";
		if (isText) return "text";
		return undefined;
	});
	watch(nodeType, () => {
		if (nodeType.value === "magic" || nodeType.value === "codeBlock") {
			hideBubble.value = true;
		} else {
			hideBubble.value = false;
		}
	});

	function getInstance() {
		return editor.value;
	}

	defineExpose({
		getInstance,
	});
</script>

<template>
	<div ref="editorBox" class="editor-background" :class="{ fullscreen: fullscreen }" @keydown="tab">
		<n-message-provider>
			<n-dialog-provider>
				<slot />
				<bubble-menu
					class="bubble-menu-bar"
					v-if="editor && editor.isEditable && bubbleMenu && nodeType"
					v-show="!hideBubble"
					:editor="editor"
					:tippy-options="{ duration: 0, maxWidth: 600, placement: 'top-start' }"
				>
					<slot name="bubble-menu" :nodeType="nodeType">
						<vivid-bubble-menu :node-type="nodeType" />
					</slot>
				</bubble-menu>

				<div
					class="editor"
					:class="{
						fullscreen: fullscreen,
						focus: isFocused && !fullscreen,
						online: page,
					}"
					spellcheck="false"
				>
					<div :class="{ 'editor-readonly': readonly }" style="width: 100%">
						<slot name="menu" :readonly="readonly">
							<vivid-menu class="editor-header" :editor="editor" />
						</slot>
					</div>
					<div class="editor-page" v-if="page">
						<editor-content
							class="editor-body editor-body-page markdown-body"
							:class="{ dark: props.dark, light: !props.dark }"
							:editor="editor"
						/>
					</div>
					<editor-content
						v-else
						class="editor-body editor-body-flow markdown-body"
						:class="{ dark: props.dark, light: !props.dark }"
						:editor="editor"
					/>
					<slot name="footer" :data="{ words, characters }">
						<vivid-footer :words="words" :characters="characters" />
					</slot>
				</div>
			</n-dialog-provider>
		</n-message-provider>
	</div>
</template>

<style scoped>
	.editor {
		border: 1px solid v-bind(vars.borderColor);
		border-radius: 3px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		height: 100%;
		transition-property: border-color, box-shadow;
		transition-duration: 0.2s;
		background: v-bind(vars.inputColor);
	}

	.bubble-menu-bar {
		background: v-bind(vars.popoverColor);
		box-shadow: v-bind(vars.boxShadow2);
		border-radius: 10px;
		overflow: hidden;
	}

	.editor-background {
		width: 100%;
		height: 100%;
	}

	.editor-background.fullscreen {
		position: fixed;
		inset: 0;
		z-index: 100;
		margin: 0;
		padding: 0;
		background: v-bind(vars.cardColor);
	}

	.editor.fullscreen {
		position: fixed;
		inset: 0;
		z-index: 1;
		margin: 0;
		padding: 0;
	}

	.editor.fullscreen:hover {
		border-color: rgba(0, 0, 0, 0) !important;
	}

	.editor-header {
		border-bottom: 1px solid #cccccc;
		box-sizing: border-box;
	}

	.editor-page {
		box-sizing: border-box;
		flex: 1 1 auto;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		padding: 40px;
		width: 100%;
		display: flex;
		justify-content: center;
		background: v-bind(vars.baseColor);
	}

	.editor-body {
		position: relative;
	}

	.editor-body-flow {
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch;
		flex: 1 1 auto;
		overflow: auto;
		padding: 40px 0;
	}

	.editor-body-page {
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch;
		padding: 40px 0;
		height: fit-content;
		min-height: 297mm;
		border-radius: 10px;
		box-shadow: v-bind(vars.boxShadow3);
		overflow: hidden;
		max-width: 210mm;
		width: 100%;
	}

	.editor-body::v-deep(.is-editor-empty) {
		height: 100%;
	}

	.editor-body::v-deep(.tiptap) {
		height: 100%;
	}

	.editor-body-page::v-deep(.is-editor-empty) {
		height: 100%;
	}

	.editor-body-page::v-deep(.tiptap) {
		height: 100%;
		min-height: inherit;
		padding-top: 40px;
		padding-bottom: 40px;
	}

	::v-deep(.tippy-box) {
		background-color: transparent;
	}

	::v-deep(.tippy-arrow) {
		color: transparent;
	}

	.editor.online {
		align-items: center;
		overflow: hidden;
	}

	.editor-readonly {
		pointer-events: none;
		opacity: 0.6;
	}
</style>
<style>
	.tiptap > * {
		margin-left: 100px !important;
		margin-right: 100px !important;
	}

	.tiptap > section {
	}
	.tiptap > section:hover::after {
		content: " ";
		position: absolute;
		inset: 0;
		box-sizing: border-box;
		z-index: 1;
		border: 1px dashed;
		color: #00bd63;
		pointer-events: none;
	}

	.tiptap > section:hover {
		position: relative;
	}

	/* Give a remote user a caret */
	.collaboration-cursor__caret {
		position: relative;
		margin-left: -1px;
		margin-right: -1px;
		border-left: 1px solid #0d0d0d;
		border-right: 1px solid #0d0d0d;
		word-break: normal;
		pointer-events: none;
	}

	/* Render the username above the caret */
	.collaboration-cursor__label {
		position: absolute;
		top: -1.4em;
		left: -1px;
		font-size: 12px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		user-select: none;
		color: #0d0d0d;
		padding: 0.1rem 0.3rem;
		border-radius: 3px 3px 3px 0;
		white-space: nowrap;
	}
</style>
