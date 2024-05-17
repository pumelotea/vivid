<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import { inject } from 'vue'
import { useAi } from './ai.js'

const props = defineProps({
	options: {
		type: Object,
		required: false,
	},
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('AI component must under VividEditor menu slot')
}

useExtension(useAi(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="sparkling-line"
				title="AI助手"
				:action="() => editorInstance.commands.activateMagic()"
				:is-active="() => {}"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
