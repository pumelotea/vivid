<script setup >
import VividMenuItem from "../../components/VividMenuItem.vue"
import Code from "@tiptap/extension-code";
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
	throw new Error('Code component must under VividEditor menu slot')
}
useExtension(Code.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
          icon="brackets-line"
          title="代码"
          :action="() => editorInstance.chain().focus().toggleCode().run()"
          :is-active="() => editorInstance.isActive('code')"
			/>
		</slot>
	</div>
</template>

<style scoped>

</style>
