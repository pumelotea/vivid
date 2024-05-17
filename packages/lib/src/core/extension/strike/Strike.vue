<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import Strike from '@tiptap/extension-strike'
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
	throw new Error('Strike component must under VividEditor menu slot')
}
useExtension(Strike.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="strikethrough"
				title="文本线"
				:action="() => editorInstance.chain().focus().toggleStrike().run()"
				:is-active="() => editorInstance.isActive('strike')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
