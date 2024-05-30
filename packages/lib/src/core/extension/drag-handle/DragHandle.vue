<script setup lang="ts">
import {NButton, NPopover, NElement} from 'naive-ui'
import {useDragHandle} from './drag-handle.js'
import {inject, onMounted, ref, PropType} from "vue"
import {Editor} from '@tiptap/core'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
  }
})

const root = ref()
const dragHandleElement = ref()
const showSlash = ref(false)
const showPop = ref(false)

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
  throw new Error('DragHandle component must under VividEditor menu slot')
}

const activePos = ref(null)

function update(editor, pos, dom) {
  if (showPop.value || showSlash.value) {
    return
  }
  activePos.value = pos
}

onMounted(() => {
  const {DragHandleExtension} = useDragHandle({element: root.value, update})
  useExtension(DragHandleExtension)
})

const items = ref([
  {
    name: '插入图片',
    cmd: '/img',
    icon: 'image-line',
    action: (range) => {
      props.editor.chain().insertContentAt(range.to, '<p></p>').focus().run()
      props.editor.storage.image.openUploader()
    }
  },
  {
    name: '插入视频',
    cmd: '/video',
    icon: 'video-line',
    action: (range) => {
      props.editor.chain().focus().insertContentAt(range.to, '<p></p>').run()
      props.editor.storage.video.openUploader()
    }
  },
  {
    name: '引用',
    cmd: '/b',
    icon: 'double-quotes-l',
    action: (range) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').toggleBlockquote().run()
  },
  {
    name: '标题1',
    cmd: '/h1',
    icon: 'h-1',
    action: (range) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').setHeading({level: 1}).run()
  },
  {
    name: '标题2',
    cmd: '/h2',
    icon: 'h-2',
    action: (range) => props.editor.chain().insertContentAt(range.to, '<p></p>').setHeading({level: 2}).run()
  },
  {
    name: '标题3',
    cmd: '/h3',
    icon: 'h-3',
    action: (range) => props.editor.chain().insertContentAt(range.to, '<p></p>').setHeading({level: 3}).run()
  },
  {
    name: '列表',
    cmd: '/list',
    icon: 'list-unordered',
    action: (range) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').toggleBulletList().run()
  },
  {
    name: '数学公式',
    cmd: '/math',
    icon: 'functions',
    action: (range) => {
      props.editor.chain().focus().insertContentAt(range.to, '<p></p>').run()
      props.editor.storage['hb-math'].openEditor()
    }
  },
  {
    name: '代码',
    cmd: '/code',
    icon: 'brackets-line',
    action: (range) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').toggleCode().run()
  },
  {
    name: '代码块',
    cmd: '/codeblock',
    icon: 'code-view',
    action: (range) => props.editor.chain().focus().insertContentAt(range.to, '<p></p>').toggleCodeBlock().run()
  },
])

const items2 = ref([
  {
    name: '上移',
    icon: 'arrow-up-s-line',
    action: (range) => {

    }
  },
  {
    name: '删除', icon: 'close-line', action: (range) => {
      const editor = props.editor
      const state = props.editor.state
      const tr = state.tr;
      editor.commands.deleteNode()
      tr.delete(range.from, range.to).scrollIntoView()
      props.editor.view.dispatch(tr);
    }
  },
  {
    name: '下移',
    icon: 'arrow-down-s-line',
    action: (range, pos) => {
      if (!pos.nextRange) {
        return
      }
      const editor = props.editor
      const nextRange = pos.nextRange
      // 假设你有两个 range
      const range1 = {...range}; // 第一个 range 的位置
      const range2 = {...pos.nextRange}; // 第二个 range 的位置
      console.log(range1,range2)
      // 交换两个 range 中的内容
      editor.view.dispatch(editor.state.tr.setMeta('swapRanges', true));

      // 创建一个交易，交换两个 range 中的内容
      editor.view.dispatch(
          editor.state.tr.setMeta('swapRanges', true).step()
      );

    }
  }
])

function doAction(e) {
  if (activePos.value) {
    e.action(activePos.value.range, activePos.value)
    showSlash.value = false
    showPop.value = false
  }
}

</script>

<template>
  <div class="drag-handle" ref="root">
    <n-popover :z-index="99999" style="padding: 0" v-model:show="showSlash" trigger="click" placement="bottom-start"
               :show-arrow="false">
      <template #trigger>
        <n-button size="tiny" block quaternary class="drag-button">
          <i class="ri-add-fill scale-125"></i>
        </n-button>
      </template>
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
    </n-popover>
    <n-popover :z-index="99999" style="padding: 0" v-model:show="showPop" trigger="click" placement="bottom-start"
               :show-arrow="false">
      <template #trigger>
        <n-button ref="dragHandleElement" block size="tiny" quaternary class="drag-button">
          <i class="ri-draggable scale-125"></i>
        </n-button>
      </template>
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
  overflow: hidden;
}

.scale-125{
  scale: 1.25;
}
</style>
