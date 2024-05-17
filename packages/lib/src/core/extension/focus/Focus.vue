<script setup>
import Focus from '@tiptap/extension-focus'
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
	throw new Error('Focus component must under VividEditor menu slot')
}
useExtension(Focus.configure(props.options))
</script>

<template>
	<div style="display: none"></div>
</template>
<style scoped></style>
