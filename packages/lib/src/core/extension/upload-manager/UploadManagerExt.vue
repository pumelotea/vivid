<script setup lang="ts">
	import { injectExtension } from "@lib/core/extension/utils/common";
	import { useUploadManager } from "@lib/core/extension/upload-manager/upload-manager";
	import { PropType } from "vue";
	import { UploadFunction } from "@lib/core/extension/types";

	const props = defineProps({
		handleUpload: {
			type: Function as PropType<UploadFunction>,
			required: false,
		},
	});

	injectExtension(
		useUploadManager({
			handleUpload: props.handleUpload,
		}),
	);
</script>

<template></template>

<style scoped></style>
