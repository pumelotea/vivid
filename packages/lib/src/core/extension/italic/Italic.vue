<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import Italic, { ItalicOptions } from "@tiptap/extension-italic";
	import { PropType } from "vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<ItalicOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Italic.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="italic"
				title="斜体"
				:action="() => editorInstance.chain().focus().toggleItalic().run()"
				:is-active="() => editorInstance.isActive('italic')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
