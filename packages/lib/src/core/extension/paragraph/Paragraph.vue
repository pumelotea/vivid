<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import Paragraph, { ParagraphOptions } from "@tiptap/extension-paragraph";
	import { PropType } from "vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<ParagraphOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Paragraph.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="paragraph"
				title="段落"
				:action="() => editorInstance.chain().focus().setParagraph().run()"
				:is-active="() => editorInstance.isActive('paragraph')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
