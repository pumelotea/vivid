<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import Subscript from '@tiptap/extension-subscript'
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
	throw new Error('Subscript component must under VividEditor menu slot')
}
useExtension(Subscript.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="subscript"
				title="上角标"
				:action="() => editorInstance.chain().focus().toggleSubscript().run()"
				:is-active="() => editorInstance.isActive('subscript')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
