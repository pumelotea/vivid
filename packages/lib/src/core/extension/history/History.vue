<script setup>
import History from '@tiptap/extension-history'
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
	throw new Error('History component must under VividEditor menu slot')
}
useExtension(History.configure(props.options))
</script>

<template>
	<div style="display: none"></div>
</template>
<style scoped></style>
