<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import { inject } from 'vue'

const editorInstance = inject('editorInstance')
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="format-clear"
				title="清除样式"
				:action="
					() =>
						editorInstance.chain().focus().clearNodes().unsetAllMarks().run()
				"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
