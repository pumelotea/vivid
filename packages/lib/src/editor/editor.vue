<script setup>
import 'remixicon/fonts/remixicon.css'
import '../style/index.css'
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useThemeVars} from 'naive-ui'
import {useEditor, EditorContent, BubbleMenu} from '@tiptap/vue-3'
import {useDebounceFn} from '@vueuse/core'
import {
  NConfigProvider, zhCN, dateZhCN
} from 'naive-ui'

import VividMenu from './components/VividMenu.vue'
import VividBubbleMenu from './components/VividBubbleMenu.vue'
import VividFooter from "./components/VividFooter.vue";

import {isDark, theme} from "../core/utils";
import ExtList from './default.js'

const vars = useThemeVars()

const props = defineProps({
  page: {
    type: Boolean,
    default: true
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
      return { duration: 100, maxWidth:600,placement:'top-start' }
    }
  },
  extensions: {
    type: Array,
    required: false,
    default: () => {
      return ExtList
    }
  }
})

const words = ref(0)
const characters = ref(0)
const fullscreen = ref(false)
const editorBox = ref(null)
const editorBoxParent = ref(null)
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

const updateEditorWordCount = useDebounceFn(() => {
  words.value = editor.value.storage.characterCount.words()
  characters.value = editor.value.storage.characterCount.characters()
}, 300)

const isFocused = ref(false)

let editor
editor = useEditor({
  content: props.modelValue,
  extensions: [
    ...props.extensions
  ],
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

})

onMounted(() => {
  editor.value.storage.fullscreen = fullscreen
})

const emit = defineEmits(['update:modelValue', 'change'])

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

onMounted(() => {
  emit('update:modelValue', editor.value.getHTML())
  emit('change', editor.value.getHTML())
  updateEditorWordCount()
})

onBeforeUnmount(() => {
  editor.value.destroy()
})

function tab(e) {
  if (e.keyCode === 9) {
    e.preventDefault()
  }
}

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
      <bubble-menu
          v-if="editor && bubbleMenu"
          :editor="editor"
          :tippy-options="tippyOptions"
      >
        <slot name="bubble-menu" :data="{editor, extensions: props.extensions}">
          <vivid-bubble-menu :editor="editor"/>
        </slot>
      </bubble-menu>
      <div
          v-if="editor"
          class="editor"
          :class="{'fullscreen':fullscreen,'focus':isFocused && !fullscreen, 'online': page}"
          spellcheck="false"
      >
        <slot name="menu" :data="{editor, extensions: props.extensions}">
          <vivid-menu
              class="editor-header"
              :editor="editor"
          />
        </slot>
        <div class="editor-page" v-if="page">
          <editor-content
              class="editor-body-page markdown-body"
              :class="{'dark': isDark, 'light': !isDark}"
              :editor="editor"
          />
        </div>
        <editor-content
            v-else
            class="editor-body markdown-body"
            :class="{'dark': isDark, 'light': !isDark}"
            :editor="editor"
        />
        <vivid-footer :words="words" :characters="characters"/>
      </div>
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
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  flex: 1 1 auto;
  overflow: auto;
  padding: 10px;
}

.editor-body-page {
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  padding: 40px;
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
