<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import { inject } from 'vue'
import { useCodeBlock } from './code-block.js'

const props = defineProps({
	options: {
		type: Object,
		required: false,
	},
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('CodeBlock component must under VividEditor menu slot')
}
useExtension(useCodeBlock(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="code-view"
				title="代码块"
				:action="() => editorInstance.chain().focus().toggleCodeBlock().run()"
				:is-active="() => editorInstance.isActive('hb-code')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
