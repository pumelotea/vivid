<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import {inject,ref} from "vue";
import {useVideo} from "./video.js";
import VividVideoModal from "./VividVideoModal.vue";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  }
})

const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension){
	throw new Error('Video component must under VividEditor menu slot')
}
useExtension(useVideo())

const HTV = ref(null)

function handleOpenVideo() {
  HTV.value.open()
}

function insertVideo(url) {
  if (url) {
    editorInstance.value.chain().focus().setHbVideo({src: url}).run()
  }
}

</script>

<template>
	<div v-if="editorInstance">
		<slot>
      <vivid-menu-item
          icon="video-line"
          title="插入视频"
          :action="handleOpenVideo"
          :is-active="() => editorInstance.isActive('hb-video')"
      />
      <vivid-video-modal
          ref="HTV"
          @ok="insertVideo"
      />
		</slot>
	</div>
</template>

<style scoped>

</style>
