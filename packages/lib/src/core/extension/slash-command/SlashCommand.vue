<script setup lang="ts">
import {onBeforeUnmount, onMounted, PropType, ref} from "vue";
import {
  SlashCommandPluginProps,
  SlashCommandSuggestPlugin,
} from "./slash-command";

const root = ref()
const props = defineProps({
  editor: {
    type: Object as PropType<SlashCommandPluginProps['editor']>,
    required: true,
  },
})

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
}

onMounted(() => {
  props.editor.registerPlugin(SlashCommandSuggestPlugin({
    editor: props.editor,
    element: root.value as HTMLElement,
    onQuery,
    updateRange,
    onKeyDown: keyDownEventFun.value
  }))
})

onBeforeUnmount(() => {
  props.editor && props.editor.unregisterPlugin('slashCommand')
})


</script>

<template>
  <div ref="root">
    <slot :query="queryValue" :range="range" :bindKeyDownEvent="bindKeyDownEvent"></slot>
  </div>
</template>
