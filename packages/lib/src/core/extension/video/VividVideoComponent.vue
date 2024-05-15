<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import VividResizer from '../../components/VividResizer.vue'
import VividMenuItem from '../../components/VividMenuItem.vue'
import VividVideoModal from './VividVideoModal.vue'
import { NPopover } from 'naive-ui'



import { onBeforeUnmount, onMounted, ref } from 'vue'




const box = ref(null)
const props = defineProps(nodeViewProps)

let player = null
function init () {
  player = new Player({
    lang        : 'zh',
    el          : box.value,
    // url           : 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    url         : props.node.attrs.src,
    playbackRate: [ 0.5, 0.75, 1, 1.5, 2 ],
    videoInit   : true,
    pip         : true // 打开画中画功能
  })
}

onMounted(init)

onBeforeUnmount(() => {
  player && player.destroy(true)
})

function onchange (width, height, reached) {
  props.updateAttributes({ width, height, 'data-full-width': reached })
}

const HTV = ref(null)
function handleOpenVideo () {
  HTV.value.open(props.node.attrs)
}

function insertVideo (url) {
  if (url) {
    player.src = url
    props.updateAttributes({ src: url })
  }
}

</script>
<template>
  <node-view-wrapper
    class="video-block"
    as="span"
  >
    <n-popover
      placement="right-start"
      :show-arrow="false"
      trigger="click"
      style="padding: 0"
    >
      <template #trigger>
        <vivid-resizer
          :selected="props.selected"
          :w="props.node.attrs.width"
          :h="props.node.attrs.height"
          @on-change="onchange"
        >
          <template #default="{width,height}">
            <div
              :style="`width: ${width}px;height: ${height}px`"
              class="video-resizer"
            >
              <div
                ref="box"
                class="video-box"
              />
            </div>
          </template>
        </vivid-resizer>
      </template>
      <div class="video-actions">
        <div class="action-item">
          <vivid-menu-item
            icon="settings-line"
            title="修改视频"
            :action="handleOpenVideo"
            :is-active="() => {}"
          />
        </div>
        <div class="action-item">
          <vivid-menu-item
            icon="delete-bin-2-line"
            title="删除"
            :action="props.deleteNode"
            :is-active="() => {}"
          />
        </div>
      </div>
    </n-popover>
  </node-view-wrapper>
  <vivid-video-modal
    ref="HTV"
    @ok="insertVideo"
  />
</template>

<style scoped>
.video-block {
  position: relative;
  max-width: 100%;
  box-sizing: border-box;
  display: inline-block;
  line-height: 0;
  float: none;
  vertical-align: baseline;
  padding: 0 5px;
}

.video-box{
  height: 100% !important;
  width: 100% !important;
}

.video-resizer{
  max-width: 100%;
}

.video-actions{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  padding-bottom: 2px;
}
.action-item{
  display: flex;
  align-items: center;
}

.action-item + .action-item{
  margin-top: 2px;
}
</style>
