<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import Subscript, { SubscriptExtensionOptions } from "@tiptap/extension-subscript";
	import { PropType } from "vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<SubscriptExtensionOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(Subscript.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="subscript"
				title="上角标"
				:action="() => editorInstance.chain().focus().toggleSubscript().run()"
				:is-active="() => editorInstance.isActive('subscript')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
