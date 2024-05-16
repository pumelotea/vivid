<script setup >
import VividMenuItem from "../../components/VividMenuItem.vue"
import ListItem from "@tiptap/extension-list-item";
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
	throw new Error('ListItem component must under VividEditor menu slot')
}
useExtension(ListItem.configure(props.options))
</script>

<template>
	  <div style="display: none"></div>
</template>

<style scoped>

</style>
