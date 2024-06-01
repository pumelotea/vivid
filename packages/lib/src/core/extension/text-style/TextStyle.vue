<script setup lang="ts">
	import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style";
	import { PropType } from "vue";
	import { injectExtension } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<TextStyleOptions>>,
			required: false,
		},
	});

	injectExtension(TextStyle.configure(props.options));
</script>

<template>
</template>

<style scoped></style>
