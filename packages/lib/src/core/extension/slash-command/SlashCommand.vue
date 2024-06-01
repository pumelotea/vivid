<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {
  SlashCommandSuggestPlugin,
} from "./slash-command";
import {inject} from "vue";
import VividSlashCommand from './VividSlashCommand.vue'

const root = ref()

const editorInstance: any = inject('editorInstance')!
const useExtension: any = inject('useExtension')
if (!useExtension) {
  throw new Error('DragHandle component must under VividEditor menu slot')
}

const queryValue = ref('')
const range = ref(null)
const keyDownEventFun = ref<((e: any) => boolean)>((e: any)=>false)

function onQuery(query: string) {
  queryValue.value = query
}

function updateRange(r: any) {
  range.value = r
}

function bindKeyDownEvent(fun: any) {
  keyDownEventFun.value = fun
  editorInstance.value.registerPlugin(SlashCommandSuggestPlugin({
    editor: editorInstance.value,
    element: root.value as HTMLElement,
    onQuery,
    updateRange,
    onKeyDown: keyDownEventFun.value
  }))
}


onBeforeUnmount(() => {
  editorInstance.value && editorInstance.value.unregisterPlugin('slashCommand')
})



</script>

<template>
  <div ref="root">
    <slot :query="queryValue" :range="range" :bindKeyDownEvent="bindKeyDownEvent">
      <vivid-slash-command v-if="editorInstance && editorInstance.isEditable" :query="queryValue" :bind-key-down-event="bindKeyDownEvent" :range="range" :editor="editorInstance"/>
    </slot>
  </div>
</template>
