<script setup lang="ts">
	import { PropType } from "vue";
	import { IndentOptions, useIndent } from "./indent";
	import { injectExtension } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<IndentOptions>>,
			required: false,
		},
	});

	injectExtension(useIndent(props.options));
</script>

<template></template>
<style scoped></style>
