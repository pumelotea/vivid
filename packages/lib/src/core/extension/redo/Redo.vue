<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { useEditorInstance } from "@lib/core/extension/utils/common";

	const editorInstance = useEditorInstance();
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
