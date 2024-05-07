<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import {inject} from "vue";
import {useTaskList} from "./task-list.js";
import {useTaskItem} from "./task-item";
const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('TaskList component must under VividEditor menu slot')
}
useExtension(useTaskList(props.options))
useExtension(useTaskItem())
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
          icon="task-line"
          title="任务列表"
          :action="() => editorInstance.chain().focus().toggleTaskList().run()"
          :is-active="() => editorInstance.isActive('taskList')"
			/>
		</slot>
	</div>
</template>

<style scoped>

</style>
