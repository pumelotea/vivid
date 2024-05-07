<script setup lang="ts">
import {inject} from "vue";
import {useIndent} from "./indent.js";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('Indent component must under VividEditor menu slot')
}
useExtension(useIndent())
</script>

<template>
  <div style="display: none"></div>
</template>
<style scoped>

</style>
