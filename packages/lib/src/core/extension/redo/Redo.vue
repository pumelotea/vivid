<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import { inject } from 'vue'

const editorInstance = inject('editorInstance')
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="arrow-go-forward-line"
				title="取消撤销"
				:action="() => editorInstance.chain().focus().redo().run()"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
