<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import {inject,ref} from "vue";
import {useImage} from "./image.js";
import VividImageModal from "./VividImageModal.vue";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('Image component must under VividEditor menu slot')
}
useExtension(useImage())

const HTI = ref(null)

function handleOpenImage() {
  HTI.value.open()
}

function insertImage(url) {
  if (url) {
    editorInstance.value.chain().focus().setHbImage({src: url}).run()
  }
}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
      <vivid-menu-item
          icon="image-line"
          title="插入图片"
          :action="handleOpenImage"
          :is-active="() => editorInstance.isActive('hb-image')"
      />
      <vivid-image-modal
          ref="HTI"
          @ok="insertImage"
      />
		</slot>
	</div>
</template>

<style scoped>

</style>
