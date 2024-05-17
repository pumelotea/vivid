<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
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
	throw new Error('HorizontalRule component must under VividEditor menu slot')
}
useExtension(HorizontalRule.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="separator"
				title="横线"
				:action="() => editorInstance.chain().focus().setHorizontalRule().run()"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
