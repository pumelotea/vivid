<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { useEditorInstance } from "@lib/core/extension/utils/common";

	const editorInstance = useEditorInstance();
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
