<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import Bold, { BoldOptions } from "@tiptap/extension-bold";
	import { PropType } from "vue";
	import { useEditorInstance, injectExtension } from "../utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<BoldOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Bold.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="bold"
				title="加粗"
				:action="() => editorInstance.chain().focus().toggleBold().run()"
				:is-active="() => editorInstance.isActive('bold')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
