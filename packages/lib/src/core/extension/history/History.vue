<script setup lang="ts">
	import History, { HistoryOptions } from "@tiptap/extension-history";
	import { PropType } from "vue";
	import { injectExtension } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<HistoryOptions>>,
			required: false,
		},
	});

	injectExtension(History.configure(props.options));
</script>

<template></template>
<style scoped></style>
