<script setup>
import Text from '@tiptap/extension-text'
import { inject } from 'vue'

const props = defineProps({
	options: {
		type: Object,
		required: false,
	},
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('Text component must under VividEditor menu slot')
}
useExtension(Text.configure(props.options))
</script>

<template>
	<div style="display: none"></div>
</template>

<style scoped></style>
