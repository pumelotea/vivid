<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { PropType } from "vue";
	import { CodeBlockLowlightOptions } from "@tiptap/extension-code-block-lowlight";
	import { useCodeBlock } from "./code-block";
	import { useEditorInstance, injectExtension } from "../utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<CodeBlockLowlightOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(useCodeBlock(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="code-view"
				title="代码块"
				:action="() => editorInstance.chain().focus().toggleCodeBlock().run()"
				:is-active="() => editorInstance.isActive('hb-code')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
