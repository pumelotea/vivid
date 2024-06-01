<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import Strike, { StrikeOptions } from "@tiptap/extension-strike";
	import { PropType } from "vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<StrikeOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Strike.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="strikethrough"
				title="文本线"
				:action="() => editorInstance.chain().focus().toggleStrike().run()"
				:is-active="() => editorInstance.isActive('strike')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
