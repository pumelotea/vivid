<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import TextAlign, { TextAlignOptions } from "@tiptap/extension-text-align";
	import { PropType } from "vue";
	import { NSpace } from "naive-ui";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<TextAlignOptions>>,
			required: false,
			default: () => {
				return {
					types: ["heading", "paragraph"],
				};
			},
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(TextAlign.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<n-space :size="2">
				<vivid-menu-item
					icon="align-left"
					title="左对齐"
					:action="() => editorInstance.chain().focus().setTextAlign('left').run()"
					:is-active="() => editorInstance.isActive('align-left')"
				/>
				<vivid-menu-item
					icon="align-center"
					title="居中"
					:action="() => editorInstance.chain().focus().setTextAlign('center').run()"
					:is-active="() => editorInstance.isActive('align-center')"
				/>
				<vivid-menu-item
					icon="align-right"
					title="右对齐"
					:action="() => editorInstance.chain().focus().setTextAlign('right').run()"
					:is-active="() => editorInstance.isActive('align-right')"
				/>
				<vivid-menu-item
					icon="align-justify"
					title="两端对齐"
					:action="() => editorInstance.chain().focus().setTextAlign('justify').run()"
					:is-active="() => editorInstance.isActive('align-justify')"
				/>
			</n-space>
		</slot>
	</div>
</template>

<style scoped></style>
