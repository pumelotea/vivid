<script setup lang="ts">
	import CharacterCount, { CharacterCountOptions } from "@tiptap/extension-character-count";
	import { PropType } from "vue";
	import { injectExtension } from "../utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<CharacterCountOptions>>,
			required: false,
		},
	});
	injectExtension(CharacterCount.configure(props.options));
</script>

<template></template>
<style scoped></style>
