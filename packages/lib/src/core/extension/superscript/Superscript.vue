<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import Superscript, { SuperscriptExtensionOptions } from "@tiptap/extension-superscript";
	import { PropType } from "vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<SuperscriptExtensionOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Superscript.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="superscript"
				title="下角标"
				:action="() => editorInstance.chain().focus().toggleSuperscript().run()"
				:is-active="() => editorInstance.isActive('superscript')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
