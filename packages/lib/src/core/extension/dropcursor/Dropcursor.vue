<script setup>
import Dropcursor from '@tiptap/extension-dropcursor'
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
	throw new Error('Dropcursor component must under VividEditor menu slot')
}
useExtension(Dropcursor.configure(props.options))
</script>

<template>
	<div style="display: none"></div>
</template>
<style scoped></style>
