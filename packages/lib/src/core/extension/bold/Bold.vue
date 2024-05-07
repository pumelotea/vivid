<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import Bold from "@tiptap/extension-bold";
import {inject} from "vue";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('Bold component must under VividEditor menu slot')
}
useExtension(Bold.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
			icon="bold"
			title="加粗"
			:action="() => editorInstance.chain().focus().toggleBold().run()"
			:is-active="() => editorInstance.isActive('bold')"
			/>
		</slot>
	</div>
</template>

<style scoped>

</style>
