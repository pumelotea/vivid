<script setup >
import Document from "@tiptap/extension-document";
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
	throw new Error('Document component must under VividEditor menu slot')
}
useExtension(Document.configure(props.options))
</script>

<template>
  <div style="display: none"></div>
</template>
<style scoped>

</style>
