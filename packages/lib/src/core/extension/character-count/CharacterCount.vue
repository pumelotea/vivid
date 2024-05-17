<script setup>
import CharacterCount from '@tiptap/extension-character-count'
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
	throw new Error('CharacterCount component must under VividEditor menu slot')
}
useExtension(CharacterCount.configure(props.options))
</script>

<template>
	<div style="display: none"></div>
</template>
<style scoped></style>
