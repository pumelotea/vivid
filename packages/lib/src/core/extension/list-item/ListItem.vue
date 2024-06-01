<script setup lang="ts">
	import ListItem, { ListItemOptions } from "@tiptap/extension-list-item";
	import { PropType } from "vue";
	import { injectExtension } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<ListItemOptions>>,
			required: false,
		},
	});

	injectExtension(ListItem.configure(props.options));
</script>

<template>
</template>

<style scoped></style>
