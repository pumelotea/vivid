<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import { inject } from 'vue'

const editorInstance = inject('editorInstance')
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="arrow-go-back-line"
				title="撤销"
				:action="() => editorInstance.chain().focus().undo().run()"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
