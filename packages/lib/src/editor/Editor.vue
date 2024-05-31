<script setup>
import 'remixicon/fonts/remixicon.css'
import '../style/index.css'
import {
	computed,
	onBeforeUnmount,
	onMounted,
	provide,
	ref,
	shallowRef,
	watch,
} from 'vue'
import { useThemeVars } from 'naive-ui'
import { EditorContent, BubbleMenu } from '@tiptap/vue-3'
import { useDebounceFn } from '@vueuse/core'
import { NMessageProvider, NDialogProvider } from 'naive-ui'

import VividMenu from './components/VividMenu.vue'
import VividBubbleMenu from './components/VividBubbleMenu.vue'
import VividFooter from './components/VividFooter.vue'
import SlashCommand from '../core/extension/slash-command/SlashCommand.vue'

import { Editor } from '@tiptap/vue-3'
import { CellSelection } from 'prosemirror-tables'
import { TextSelection } from '@tiptap/pm/state'
import VividSlashCommand from "./components/VividSlashCommand.vue";
import DragHandle from "../core/extension/drag-handle/DragHandle.vue"
const vars = useThemeVars()

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
		default: '',
	},
	to: {
		type: String,
		required: false,
		default: '',
	},
	tippyOptions: {
		type: Object,
		required: false,
		default: () => {
			return { duration: 0, maxWidth: 600, placement: 'top-start' }
		},
	},
  readonly: {
    type: Boolean,
    default: false,
  }
})

let internalExt = []
const editor = shallowRef()
const words = ref(0)
const characters = ref(0)
const fullscreen = ref(false)
const editorBox = ref(null)
const editorBoxParent = ref(null)
const isFocused = ref(false)

const emit = defineEmits(['update:modelValue', 'change'])

provide('useExtension', useExtension)
provide('removeExtension', removeExtension)
provide('editorInstance', editor)

const updateEditorWordCount = useDebounceFn(() => {
	words.value = editor.value.storage.characterCount.words()
	characters.value = editor.value.storage.characterCount.characters()
}, 300)

function useExtension(ext) {
	if (internalExt.filter((e) => e === ext).length) {
		return
	}
	internalExt.push(ext)
}

function removeExtension(extName) {
	const index = internalExt.findIndex((e) => e.name === extName)
	if (index > -1) {
		internalExt.splice(index, 1)
	}
}

function initEditor() {
	const opt = {
		content: props.modelValue,
    editable: !props.readonly,
		extensions: internalExt,
		onUpdate: ({ editor }) => {
			// HTML
			emit('update:modelValue', editor.getHTML())

			// JSON
			// this.$emit('update:modelValue', this.editor.getJSON())

			updateEditorWordCount()
		},
		onFocus: () => {
			isFocused.value = true
		},
		onBlur: () => {
			isFocused.value = false
		},
		onSelectionUpdate: ({ editor }) => {},
	}
	editor.value = new Editor(opt)
	editor.value.storage.fullscreen = fullscreen
	emit('update:modelValue', editor.value.getHTML())
	emit('change', editor.value.getHTML())
	updateEditorWordCount()
}

onMounted(() => {
	initEditor()
})

watch(()=> props.readonly ,(value)=>{
  if (editor.value){
    editor.value.setEditable(!value)
  }
})

watch(
	() => props.modelValue,
	(value) => {
		// HTML
		const isSame = editor.value.getHTML() === value

		// JSON
		// const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

		if (isSame) {
			return
		}

		editor.value.commands.setContent(value, false)
	}
)

watch(fullscreen, () => {
	if (fullscreen.value === true) {
		if (props.to) {
			editorBoxParent.value = editorBox.value.parentNode
			document.getElementById(props.to).append(editorBox.value)
		}
	} else {
		if (props.to) {
			editorBoxParent.value.append(editorBox.value)
		}
	}
})

onBeforeUnmount(() => {
	editor.value?.destroy()
})

function tab(e) {
	if (e.keyCode === 9) {
		e.preventDefault()
	}
}


const hideBubble = ref(false)
const nodeType = computed(() => {
	if (!editor.value) {
		return undefined
	}
	const selection = editor.value.state.selection
	const isImage = selection.node?.type.name === 'image'
	const isVideo = selection.node?.type.name === 'video'
	const isMagic = selection.node?.type.name === 'magic'
	const isMath = selection.node?.type.name === 'hb-math'
	const isCell = selection instanceof CellSelection
	const isTable = selection.node?.type.name === 'table' || isCell // 选中表格或者单元格
	const isText = selection instanceof TextSelection
	if (isImage) return 'image'
	if (isVideo) return 'video'
	if (isTable) return 'table'
	if (isText) return 'text'
	if (isMagic) return 'magic'
	if (isMath) return 'math'
	return undefined
})
watch(nodeType, () => {
	if (nodeType.value === 'table' || nodeType.value === 'magic') {
		hideBubble.value = true
	} else {
		hideBubble.value = false
	}
})

function getInstance() {
	return editor.value
}

defineExpose({
	getInstance,
})
</script>

<template>
	<div
		ref="editorBox"
		class="editor-background"
		:class="{ fullscreen: fullscreen }"
		@keydown="tab"
	>
		<n-message-provider>
			<n-dialog-provider>
        <drag-handle :editor="editor">
          <template v-slot:drag-handle-slash="{activePos}">
            <slot name="drag-handle-slash" :activePos="activePos"></slot>
          </template>
          <template v-slot:drag-handle-select="{activePos}">
            <slot name="drag-handle-select" :activePos="activePos"></slot>
          </template>
        </drag-handle>
				<slash-command :editor="editor" v-if="editor && editor.isEditable">
          <template v-slot:default="{query, range, bindKeyDownEvent}">
            <slot name="slash-command" :query="query" :range="range" :bindKeyDownEvent="bindKeyDownEvent">
              <vivid-slash-command :editor="editor" :query="query" :range="range" :bindKeyDownEvent="bindKeyDownEvent"/>
            </slot>
          </template>
        </slash-command>
				<bubble-menu
					v-if="editor && editor.isEditable && bubbleMenu"
					v-show="!hideBubble"
					:editor="editor"
					:tippy-options="tippyOptions"
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
          <div :class="{'editor-readonly': readonly}">
            <slot name="menu" :readonly="readonly">
              <vivid-menu class="editor-header" :editor="editor"/>
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
	border-radius: 3px;
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

.editor-readonly{
  pointer-events: none;
  opacity: 0.6;
}
</style>
<style>
.tiptap > * {
	margin-left: 100px !important;
	margin-right: 100px !important;
}
.tiptap > .vivid-table {
	margin-left: 85px !important;
	margin-top: -25px !important;
	margin-bottom: 10px !important;
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
