<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import Code, { CodeOptions } from "@tiptap/extension-code";
	import { PropType } from "vue";
	import { useEditorInstance, injectExtension } from "../utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<CodeOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Code.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="brackets-line"
				title="代码"
				:action="() => editorInstance.chain().focus().toggleCode().run()"
				:is-active="() => editorInstance.isActive('code')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
