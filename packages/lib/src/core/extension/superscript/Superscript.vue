<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import Superscript from '@tiptap/extension-superscript'
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
	throw new Error('Superscript component must under VividEditor menu slot')
}
useExtension(Superscript.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="superscript"
				title="下角标"
				:action="() => editorInstance.chain().focus().toggleSuperscript().run()"
				:is-active="() => editorInstance.isActive('superscript')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
