<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import HorizontalRule, { HorizontalRuleOptions } from "@tiptap/extension-horizontal-rule";
	import { PropType } from "vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<HorizontalRuleOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(HorizontalRule.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="separator"
				title="横线"
				:action="() => editorInstance.chain().focus().setHorizontalRule().run()"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
