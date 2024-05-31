<script setup lang="ts">
import {NButton, NPopover, NElement, useThemeVars} from 'naive-ui'
import {useDragHandle} from './drag-handle.js'
import {inject, onMounted, ref, PropType, watch, Ref} from "vue"
import {Editor} from '@tiptap/core'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
		required: true
  }
})
const vars = useThemeVars()
const root = ref()
const showSlash = ref(false)
const showPop = ref(false)

const editorInstance: any = inject('editorInstance')!
const useExtension: any = inject('useExtension')
if (!useExtension) {
  throw new Error('DragHandle component must under VividEditor menu slot')
}

const activePos = ref<any>(null)
let lockPosFun: any = null

function update(editor:Editor, pos:number, dom: HTMLElement) {
  if (showPop.value || showSlash.value) {
    return
  }
  activePos.value = pos
}

onMounted(() => {
  const {DragHandleExtension, lockPos} = useDragHandle({element: root.value, update}) as any
  lockPosFun = lockPos
  useExtension(DragHandleExtension)
})

const items = ref([
  {
    name: '插入图片',
    cmd: '/img',
    icon: 'image-line',
    action: (range: any) => {
      props.editor.chain().insertContentAt(range.to, '<p></p>').focus().run()
      props.editor.storage.image.openUploader()
    }
  },
  {
    name: '插入视频',
    cmd: '/video',
    icon: 'video-line',
    action: (range: any) => {
      props.editor.chain().focus().insertContentAt(range.to, '<p></p>').run()
      props.editor.storage.video.openUploader()
    }
  },
  {
    name: '引用',
    cmd: '/b',
    icon: 'double-quotes-l',
    action: (range: any) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').toggleBlockquote().run()
  },
  {
    name: '标题1',
    cmd: '/h1',
    icon: 'h-1',
    action: (range: any) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').setHeading({level: 1}).run()
  },
  {
    name: '标题2',
    cmd: '/h2',
    icon: 'h-2',
    action: (range: any) => props.editor.chain().insertContentAt(range.to, '<p></p>').setHeading({level: 2}).run()
  },
  {
    name: '标题3',
    cmd: '/h3',
    icon: 'h-3',
    action: (range: any) => props.editor.chain().insertContentAt(range.to, '<p></p>').setHeading({level: 3}).run()
  },
  {
    name: '列表',
    cmd: '/list',
    icon: 'list-unordered',
    action: (range: any) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').toggleBulletList().run()
  },
  {
    name: '数学公式',
    cmd: '/math',
    icon: 'functions',
    action: (range: any) => {
      props.editor.chain().focus().insertContentAt(range.to, '<p></p>').run()
      props.editor.storage['hb-math'].openEditor()
    }
  },
  {
    name: '代码',
    cmd: '/code',
    icon: 'brackets-line',
    action: (range: any) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').toggleCode().run()
  },
  {
    name: '代码块',
    cmd: '/codeblock',
    icon: 'code-view',
    action: (range: any) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').toggleCodeBlock().run()
  },
])

const items2 = ref([
  {
    name: '上移一行',
    icon: 'arrow-up-s-line',
    action: (range: any, pos: any) => {
      if (!pos.preRange) {
        return
      }
      const editor = props.editor
      const state = props.editor.state
      const tr = state.tr
      const range1 = {...pos.preRange}; // 第二个 range 的位置
      const range2 = {...range}; // 第一个 range 的位置
      const fromNode = state.doc.cut(range1.from, range1.to)
      const toNode = state.doc.cut(range2.from, range2.to)
      tr.replaceRangeWith(range2.from, range2.to, fromNode)
      tr.replaceRangeWith(range1.from, range1.to, toNode)
      editor.view.dispatch(tr)
    }
  },
  {
    name: '删除本行', icon: 'close-line', action: (range: any) => {
      const editor = props.editor
      const state = props.editor.state
      const tr = state.tr;
      tr.delete(range.from, range.to).scrollIntoView()
      props.editor.view.dispatch(tr);
    }
  },
  {
    name: '下移一行',
    icon: 'arrow-down-s-line',
    action: (range: any, pos: any) => {
      if (!pos.nextRange) {
        return
      }
      const editor = props.editor
      const state = props.editor.state
      const tr = state.tr
      const range1 = {...range}; // 第一个 range 的位置
      const range2 = {...pos.nextRange}; // 第二个 range 的位置
      const fromNode = state.doc.cut(range1.from, range1.to)
      const toNode = state.doc.cut(range2.from, range2.to)
      tr.replaceRangeWith(range2.from, range2.to, fromNode)
      tr.replaceRangeWith(range1.from, range1.to, toNode)
      editor.view.dispatch(tr)
    }
  }
])

function doAction(e: any) {
  if (activePos.value) {
    e.action(activePos.value.range, activePos.value)
    showSlash.value = false
    showPop.value = false
  }
}

watch([showSlash, showPop],()=>{
  if (showSlash.value || showPop.value){
    lockPosFun(true)
  }else{
    lockPosFun(false)
  }
})

</script>

<template>
  <div class="drag-handle" ref="root">
      <n-popover :z-index="99999" style="padding: 0" v-model:show="showSlash" trigger="click" placement="bottom-start"
                 :show-arrow="false">
        <template #trigger>
          <div class="drag-button">
            <i class="ri-add-fill"></i>
          </div>
        </template>
        <slot name="drag-handle-slash" :activePos="activePos">
          <n-element class="slash-command">
            <div class="slash-item" v-for="(e, i) in items" @click="doAction(e)" :key="e.cmd">
              <div class="slash-name">
                <div class="slash-icon">
                  <i :class="`ri-${e.icon}`"></i>
                </div>
                <span>{{ e.name }}</span>
              </div>
            </div>
          </n-element>
        </slot>
      </n-popover>
      <n-popover :z-index="99999" style="padding: 0" v-model:show="showPop" trigger="click" placement="bottom-start"
                 :show-arrow="false">
        <template #trigger>
          <div class="drag-button">
            <i class="ri-draggable"></i>
          </div>
        </template>
        <slot name="drag-handle-select" :activePos="activePos">
          <n-element class="slash-command">
            <div class="slash-item" v-for="(e, i) in items2" @click="doAction(e)" :key="e.name">
              <div class="slash-name">
                <div class="slash-icon">
                  <i :class="`ri-${e.icon}`"></i>
                </div>
                <span>{{ e.name }}</span>
              </div>
            </div>
          </n-element>
        </slot>
      </n-popover>
    </div>
</template>

<style scoped>
.slash-command {
  width: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  outline: none;
  border: none;
  user-select: none;
}

.slash-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  transition: all 0.5s;
}

.slash-item:hover {
  background: var(--hover-color);
}


.slash-name {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
}

.slash-icon {
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
}


.drag-handle {
  align-items: center;
  display: none;
  gap: 2px;
}

.drag-button{
  width: 24px;
  height: 24px;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: v-bind(vars.textColor3);
}

.drag-button:hover {
  background: v-bind(vars.hoverColor);
  border: 1px solid v-bind(vars.borderColor);
}

</style>
