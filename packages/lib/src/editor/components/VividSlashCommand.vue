<script setup>
import {computed, ref, watch} from "vue";
import {useThemeVars} from 'naive-ui'

const vars = useThemeVars()
const props = defineProps({
  query: {
    type: String,
    default: ''
  },
  editor: {
    required: true,
  },
  range: {
    required: true,
  },
  bindKeyDownEvent: {
    required: true,
  }
})
const items = ref([
  {
    name: '插入图片',
    cmd: '/img',
    icon: 'image-line',
    action: () => {
      props.editor.chain().focus().deleteRange(props.range).run()
      props.editor.storage.image.openUploader()
    }
  },
  {
    name: '插入视频', cmd: '/video', icon: 'video-line', action: () => {
      props.editor.chain().focus().deleteRange(props.range).run()
      props.editor.storage.video.openUploader()
    }
  },
  {
    name: '标题1',
    cmd: '/h1',
    icon: 'h-1',
    action: () => props.editor.chain().focus().deleteRange(props.range).toggleHeading({level: 1}).run()
  },
  {
    name: '标题2',
    cmd: '/h2',
    icon: 'h-2',
    action: () => props.editor.chain().focus().deleteRange(props.range).toggleHeading({level: 2}).run()
  },
  {
    name: '标题3',
    cmd: '/h3',
    icon: 'h-3',
    action: () => props.editor.chain().focus().deleteRange(props.range).toggleHeading({level: 3}).run()
  },
  {
    name: '列表',
    cmd: '/list',
    icon: 'list-unordered',
    action: () => props.editor.chain().focus().deleteRange(props.range).toggleBulletList().run()
  },
  {
    name: '数学公式', cmd: '/math', icon: 'functions', action: () => {
      props.editor.chain().focus().deleteRange(props.range).run()
      props.editor.storage['hb-math'].openEditor()
    }
  },
  {
    name: '代码块',
    cmd: '/codeblock',
    icon: 'code-view',
    action: () => props.editor.chain().focus().deleteRange(props.range).toggleCodeBlock().run()
  },
])

const renderList = computed(() => {
  return items.value.filter(e => e.cmd.startsWith(`/${props.query}`))
})

const selectedIndex = ref(-1)
props.bindKeyDownEvent(onKeyDown)

watch(() => props.query, () => {
  selectedIndex.value = -1
})

function onKeyDown(e) {
  if (e.key === 'Enter') {
    renderList.value[selectedIndex.value].action()
    return true
  }
  if (e.key === 'ArrowDown') {
    selectedIndex.value++
    if (renderList.value.length === 0) {
      selectedIndex.value = -1
      return true
    }
    if (selectedIndex.value > renderList.value.length - 1) {
      selectedIndex.value = renderList.value.length - 1
      return true
    }
    return true
  }
  if (e.key === 'ArrowUp') {
    selectedIndex.value--
    if (renderList.value.length === 0) {
      selectedIndex.value = -1
      return true
    }
    if (selectedIndex.value < 0) {
      selectedIndex.value = 0
      return true
    }
    return true
  }
  return false
}

</script>

<template>
  <div class="slash-command" v-show="renderList.length > 0">
    <div class="slash-item" v-for="(e, i) in renderList" @click="e.action()" :key="e.cmd" :class="{'active':selectedIndex === i}">
      <div class="slash-name">
        <i :class="`ri-${e.icon}`"></i>
        <span>{{ e.name }}</span>
      </div>
      <div class="slash-command-value">
        {{ e.cmd }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.slash-command {
  background: v-bind(vars.popoverColor);
  width: 180px;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: v-bind(vars.boxShadow3);
  outline: none;
  border: none;
  user-select: none;
}

.slash-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  transition: all 0.5s;
}

.slash-item:hover {
  background: v-bind(vars.hoverColor);
}

.slash-item.active {
  background: v-bind(vars.hoverColor);
}

.slash-name {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  color: v-bind(vars.textColor2);
}

.slash-command-value {
  font-size: 10px;
  color: v-bind(vars.textColor1);
  border: 1px solid v-bind(vars.textColor3);
  border-radius: 4px;
  opacity: 0.4;
  padding: 2px 6px;
  box-sizing: border-box;
}
</style>
