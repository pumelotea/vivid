<script setup lang="ts">
	import HardBreak, { HardBreakOptions } from "@tiptap/extension-hard-break";
	import { PropType } from "vue";
	import { injectExtension } from "../utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<HardBreakOptions>>,
			required: false,
		},
	});

	injectExtension(HardBreak.configure(props.options));
</script>

<template></template>
<style scoped></style>
