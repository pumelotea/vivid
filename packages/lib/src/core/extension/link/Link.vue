<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import {inject,ref} from "vue";
import VividLinkModal from "./VividLinkModal.vue";
import {useLink} from "./link.js";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('Link component must under VividEditor menu slot')
}
useExtension(useLink(props.options))


const HTL = ref(null)

function handleOpenLink() {
  if (editorInstance.value.isActive('link')) {
    editorInstance.value.chain().focus().unsetLink().run()
  } else {
    HTL.value.open()
  }
}

function toggleLink(href, target) {
  editorInstance.value.chain().focus().toggleLink({href, target}).run()
}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
      <vivid-menu-item
          icon="link"
          title="超链接"
          :action="handleOpenLink"
          :is-active="() => editorInstance.isActive('link')"
      />
      <vivid-link-modal
          ref="HTL"
          @ok="toggleLink"
      />
		</slot>
	</div>
</template>

<style scoped>

</style>
