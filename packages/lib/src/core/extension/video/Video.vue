<script setup lang="ts">
import VividMenuItem from "../../components/VividMenuItem.vue"
import {inject,ref} from "vue";
import {useVideo} from "./video.js";
import VividVideoModal from "./VividVideoModal.vue";

const props = defineProps({
  options: {
    type: Object,
    required: false,
  },
  handleUpload: {
    type: Function,
    required: false,
    default: null,
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
  // editorInstance.value.chain().focus().setVideo({src: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4'}).run()
}

function insertVideo(url) {
  if (url) {
    editorInstance.value.chain().focus().setVideo({src: url}).run()
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
          :is-active="() => editorInstance.isActive('video')"
      />
      <vivid-video-modal
          :handle-upload="handleUpload"
          ref="HTV"
          @ok="insertVideo"
      />
		</slot>
	</div>
</template>

<style scoped>

</style>
