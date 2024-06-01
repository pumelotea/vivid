<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import OrderedList, { OrderedListOptions } from "@tiptap/extension-ordered-list";
	import { PropType } from "vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<OrderedListOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(OrderedList.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="list-ordered"
				title="有序列表"
				:action="() => editorInstance.chain().focus().toggleOrderedList().run()"
				:is-active="() => editorInstance.isActive('orderedList')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
