<script setup lang="ts">
	import { UploadFunction } from "@lib/core/extension/types";
	import { onMounted, PropType, ref } from "vue";
	import { NSpin } from "naive-ui";

	const percent = ref(0);
	const url = ref("");

	function onProgress(n: number) {
		if (n >= 100) {
			n = 100;
		}
		percent.value = n;
	}

	const props = defineProps({
		handleUpload: {
			type: Function as PropType<UploadFunction>,
			required: true,
		},
		file: {
			type: Object as PropType<File>,
			required: true,
		},
		onSuccess: {
			type: Function as PropType<(url: string) => void>,
			required: true,
		},
		destroy: {
			type: Function as PropType<() => void>,
		},
	});

	onMounted(() => {
		url.value = URL.createObjectURL(props.file);
		props.handleUpload(props.file, onProgress).then((url) => {
			props.onSuccess(url);
			setTimeout(() => {
				props.destroy && props.destroy();
			});
		});
	});
</script>
<template>
	<div class="placeholder-image">
		<img class="preview-image" :src="url" />
		<div class="upload-controller">
			<n-spin :size="20" stroke="white"> </n-spin>
			<div class="upload-percent"> {{ percent }}% </div>
		</div>
	</div>
</template>

<style scoped>
	.placeholder-image {
		position: relative;
		overflow: hidden;
		display: flex;
	}

	.preview-image {
		width: 100%;
		height: fit-content;
	}

	.upload-controller {
		position: absolute;
		inset: 0;
		z-index: 10;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		flex-direction: column;
		gap: 15px;
		overflow: hidden;
		box-sizing: border-box;
	}

	.upload-percent {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
	}
</style>
