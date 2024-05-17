<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import Paragraph from '@tiptap/extension-paragraph'
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
	throw new Error('Paragraph component must under VividEditor menu slot')
}
useExtension(Paragraph.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="paragraph"
				title="段落"
				:action="() => editorInstance.chain().focus().setParagraph().run()"
				:is-active="() => editorInstance.isActive('paragraph')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
