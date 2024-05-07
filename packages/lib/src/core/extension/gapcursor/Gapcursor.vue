<script setup lang="ts">
import Gapcursor from "@tiptap/extension-gapcursor";
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
	throw new Error('Gapcursor component must under VividEditor menu slot')
}
useExtension(Gapcursor.configure(props.options))
</script>

<template>
  <div style="display: none"></div>
</template>
<style scoped>

</style>
