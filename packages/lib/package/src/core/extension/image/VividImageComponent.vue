<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import VividResizer from '../../components/VividResizer.vue'
import { NPopover } from 'naive-ui'
import VividMenuItem from '../../components/VividMenuItem.vue'
import VividImageModal from './VividImageModal.vue'
import { ref } from 'vue'
const props = defineProps(nodeViewProps)

function onchange (width, height) {
  props.updateAttributes({ width, height })
}

const HTI = ref(null)

function handleOpenImage () {
  HTI.value.open(props.node.attrs)
}

function insertImage (url) {
  if (url) {
    props.updateAttributes({ src: url })
  }
}

</script>
<template>
  <node-view-wrapper
    class="image-block"
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
            <img
              :width="width"
              :height="height"
              class="main-image"
              :src="props.node.attrs.src"
              draggable="false"
            >
          </template>
        </vivid-resizer>
      </template>
      <div class="image-actions">
        <div class="action-item">
          <vivid-menu-item
            icon="settings-line"
            title="修改图片"
            :action="handleOpenImage"
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
  <vivid-image-modal
    ref="HTI"
    @ok="insertImage"
  />
</template>

<style scoped>
.image-block {
  position: relative;
  max-width: 100%;
  box-sizing: border-box;
  display: inline-block;
  line-height: 0;
  float: none;
  vertical-align: baseline;
  padding: 0 5px;
}

.main-image{
  display: block !important;
  margin: 0!important;
  padding: 0!important;
}

.image-actions{
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
