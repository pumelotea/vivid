<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { PropType } from "vue";
	import { useTaskList } from "./task-list";
	import { useTaskItem } from "./task-item";
	import { TaskListOptions } from "@tiptap/extension-task-list";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<TaskListOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(useTaskList(props.options));
	injectExtension(useTaskItem());
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="list-check-3"
				title="任务列表"
				:action="() => editorInstance.chain().focus().toggleTaskList().run()"
				:is-active="() => editorInstance.isActive('taskList')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
