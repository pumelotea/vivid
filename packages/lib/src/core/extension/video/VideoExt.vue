<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { PropType, ref } from "vue";
	import { UploadFunction, useVideo } from "./video.js";
	import VividVideoModal from "./VividVideoModal.vue";
	import {
		injectExtension,
		onEditorCreated,
		useEditorInstance,
	} from "@lib/core/extension/utils/common";

	const props = defineProps({
		handleUpload: {
			type: Function as PropType<UploadFunction>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(useVideo());

	const HTV = ref<any>(null);

	function handleOpenVideo() {
		HTV.value.open();
	}

	onEditorCreated(() => {
		editorInstance.value.storage.video = {
			openUploader: handleOpenVideo,
		};
	});

	function insertVideo(url: string) {
		if (url) {
			editorInstance.value.chain().focus().setVideo({ src: url }).run();
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
			<vivid-video-modal :handle-upload="handleUpload" ref="HTV" @ok="insertVideo" />
		</slot>
	</div>
</template>

<style scoped></style>
