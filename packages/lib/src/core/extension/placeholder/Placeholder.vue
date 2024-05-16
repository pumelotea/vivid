<script setup >
import {inject} from "vue";
import {usePlaceholder} from "./placeholder.js";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
  throw new Error('Placeholder component must under VividEditor menu slot')
}
useExtension(usePlaceholder(props.options))
</script>

<template>
  <div style="display: none"></div>
</template>

<style scoped>

</style>
