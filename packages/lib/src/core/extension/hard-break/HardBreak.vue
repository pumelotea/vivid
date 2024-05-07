<script setup lang="ts">
import HardBreak from "@tiptap/extension-hard-break";
import {inject} from "vue";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('HardBreak component must under VividEditor menu slot')
}
useExtension(HardBreak.configure(props.options))
</script>

<template>
  <div style="display: none"></div>
</template>
<style scoped>

</style>
