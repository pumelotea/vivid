<script setup>
import {computed, inject, ref} from 'vue'
import { NSpace } from 'naive-ui'
import VividMenuItem from '../../../core/components/VividMenuItem.vue'
import VividMathModal from './VividMathModal.vue'
import {Editor} from "@tiptap/core";

const editorInstance = inject('editorInstance')

const HTM = ref(null)
function handleOpenMath() {
  const selection = editorInstance.value.state.selection
  if (selection.node){
    HTM.value.open(selection.node.attrs.tex)
  }
}

function deleteNode(){
  editorInstance.value.commands.deleteSelection()
}

function onok(val) {
  if (!val) {
    editorInstance.value.commands.deleteSelection()
    return
  }
  const selection = editorInstance.value.state.selection
  const editor = editorInstance.value

  editor.commands.command(({ tr }) => {
    const pos = selection.from
    tr.setNodeMarkup(pos, undefined, {
      tex: val
    })
    return true
  })
}

</script>

<template>
	<div>
		<n-space :size="2">
      <vivid-menu-item
          icon="edit-box-line"
          title="修改公式"
          :action="handleOpenMath"
          :is-active="() => {}"
      />
      <vivid-menu-item
          icon="delete-bin-2-line"
          title="删除"
          :action="deleteNode"
          :is-active="() => {}"
      />
		</n-space>
    <vivid-math-modal ref="HTM" @ok="onok" />
	</div>
</template>
