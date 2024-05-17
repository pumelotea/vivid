<script setup>
import { inject } from 'vue'
import { useHocuspocus, getRandomColor } from './hocuspocus.js'

const props = defineProps({
	options: {
		type: Object,
		required: true,
	},
	user: {
		type: Object,
		required: false,
		default: () => {
			return {
				// avatar: '',
				// name: '',
				color: getRandomColor(),
			}
		},
	},
})

const editorInstance = inject('editorInstance')
const removeExtension = inject('removeExtension')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('Hocuspocus component must under VividEditor menu slot')
}
removeExtension('history')
useHocuspocus(props.options, props.user).map((e) => {
	useExtension(e)
})
</script>

<template>
	<div style="display: none"></div>
</template>
<style scoped></style>
