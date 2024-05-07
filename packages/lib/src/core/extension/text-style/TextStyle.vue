<script setup lang="ts">
import TextStyle from "@tiptap/extension-text-style";
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
	throw new Error('TextStyle component must under VividEditor menu slot')
}
useExtension(TextStyle.configure(props.options))
</script>

<template>
	<div style="display: none">
	</div>
</template>

<style scoped>

</style>
