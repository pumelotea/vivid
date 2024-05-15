<script setup>
import 'remixicon/fonts/remixicon.css'
import '../style/index.css'
import {onBeforeUnmount, onMounted, provide, ref, shallowRef, toRaw, unref, watch} from 'vue'
import {useThemeVars} from 'naive-ui'
import {EditorContent, BubbleMenu} from '@tiptap/vue-3'
import {useDebounceFn} from '@vueuse/core'
import {
  NConfigProvider,
  zhCN,
  dateZhCN,
  NMessageProvider,
  NDialogProvider,
} from 'naive-ui'

import VividMenu from './components/VividMenu.vue'
import VividBubbleMenu from './components/VividBubbleMenu.vue'
import VividFooter from "./components/VividFooter.vue";

import {isDark, theme} from "../core/utils";
import {Editor} from "@tiptap/vue-3";
const vars = useThemeVars()

const props = defineProps({
  page: {
    type: Boolean,
    default: false
  },
  bubbleMenu: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    required: false,
    default: ''
  },
  tippyOptions:{
    type: Object,
    required:false,
    default: ()=>{
      return { duration: 0, maxWidth:600,placement:'top-start' }
    }
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

provide('useExtension',useExtension)
provide('removeExtension',removeExtension)
provide('editorInstance',editor)

const updateEditorWordCount = useDebounceFn(() => {
  words.value = editor.value.storage.characterCount.words()
  characters.value = editor.value.storage.characterCount.characters()
}, 300)

function useExtension(ext){
	if (internalExt.filter(e=>e === ext).length){
		return
	}
  internalExt.push(ext)
}

function removeExtension(extName){
  const index = internalExt.findIndex(e=>e.name === extName)
  if (index > -1){
    internalExt.splice(index, 1)
  }
}

function initEditor(){
  const opt = {
    content: props.modelValue,
    extensions: internalExt,
    onUpdate: ({editor}) => {
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
    onSelectionUpdate: ({editor}) => {
    }
  }
  editor.value = new Editor(opt)
  editor.value.storage.fullscreen = fullscreen
  emit('update:modelValue', editor.value.getHTML())
  emit('change', editor.value.getHTML())
  updateEditorWordCount()
}

onMounted(()=>{
	initEditor()
})


watch(() => props.modelValue, (value) => {
  // HTML
  const isSame = editor.value.getHTML() === value

  // JSON
  // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

  if (isSame) {
    return
  }

  editor.value.commands.setContent(value, false)
})

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

function getInstance(){
	return editor.value
}

defineExpose({
	getInstance
})

</script>

<template>
  <div
      ref="editorBox"
      class="editor-background"
      :class="{'fullscreen':fullscreen}"
      @keydown="tab"
  >
    <n-config-provider
        :theme="theme"
        :locale="zhCN"
        :date-locale="dateZhCN"
        style="height: 100%"
    >
      <n-message-provider>
        <n-dialog-provider>
      <bubble-menu
          v-if="editor && bubbleMenu"
          :editor="editor"
          :tippy-options="tippyOptions"
      >
        <slot name="bubble-menu">
          <vivid-bubble-menu :editor="editor"/>
        </slot>
      </bubble-menu>

      <div
          class="editor"
          :class="{'fullscreen':fullscreen,'focus':isFocused && !fullscreen, 'online': page}"
          spellcheck="false"
      >
        <slot name="menu">
          <vivid-menu
              class="editor-header"
              :editor="editor"
          />
        </slot>
        <div class="editor-page" v-if="page">
          <editor-content
              class="editor-body editor-body-page markdown-body"
              :class="{'dark': isDark, 'light': !isDark}"
              :editor="editor"
          />
        </div>
        <editor-content
            v-else
            class="editor-body editor-body-flow markdown-body"
            :class="{'dark': isDark, 'light': !isDark}"
            :editor="editor"
        />
        <vivid-footer :words="words" :characters="characters"/>
      </div>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
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
  z-index: 1;
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

.editor-page{
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

}

.editor-body-flow{
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
::v-deep(.tippy-arrow ) {
  color: transparent;
}
.editor.online{
  align-items: center;
  overflow: hidden;
}
</style>
<style>


.tiptap > * {
  margin-left: 50px !important;
  margin-right: 50px !important;
}
.tiptap > .vivid-table {
  margin-left: 35px !important;
  margin-top: -30px !important;
  margin-bottom: 10px !important;
}


/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
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
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
</style>
