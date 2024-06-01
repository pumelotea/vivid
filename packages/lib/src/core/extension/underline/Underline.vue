<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import Underline, { UnderlineOptions } from "@tiptap/extension-underline";
	import { PropType } from "vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common.js";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<UnderlineOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Underline.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="underline"
				title="下划线"
				:action="() => editorInstance.chain().focus().toggleUnderline().run()"
				:is-active="() => editorInstance.isActive('underline')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
