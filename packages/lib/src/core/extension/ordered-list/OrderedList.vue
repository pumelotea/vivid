<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import OrderedList from "@tiptap/extension-ordered-list";
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
	throw new Error('OrderedList component must under VividEditor menu slot')
}
useExtension(OrderedList.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
          icon="list-ordered"
          title="有序列表"
          :action="() => editorInstance.chain().focus().toggleOrderedList().run()"
          :is-active="() => editorInstance.isActive('orderedList')"
			/>
		</slot>
	</div>
</template>

<style scoped>

</style>
