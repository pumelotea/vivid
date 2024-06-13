<script setup lang="ts">
	import { PropType } from "vue";
	import { usePlaceholder } from "./placeholder.js";
	import { PlaceholderOptions } from "@tiptap/extension-placeholder";
	import { injectExtension } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<PlaceholderOptions>>,
			required: false,
		},
	});

	injectExtension(usePlaceholder(props.options));
</script>

<template></template>

<style scoped></style>
