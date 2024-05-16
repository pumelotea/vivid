<script setup>
import VividMenuItem from "../../components/VividMenuItem.vue"
import BulletList from "@tiptap/extension-bullet-list";
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
	throw new Error('BulletList component must under VividEditor menu slot')
}
useExtension(BulletList.configure(props.options))
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
          icon="list-unordered"
          title="无序列表"
          :action="() => editorInstance.chain().focus().toggleBulletList().run()"
          :is-active="() => editorInstance.isActive('bulletList')"
			/>
		</slot>
	</div>
</template>

<style scoped>

</style>
