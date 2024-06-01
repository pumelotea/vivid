<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import BulletList, { BulletListOptions } from "@tiptap/extension-bullet-list";
	import { PropType } from "vue";
	import { useEditorInstance, injectExtension } from "../utils/common";

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<BulletListOptions>>,
			required: false,
		},
	});

	const editorInstance = useEditorInstance();
	injectExtension(BulletList.configure(props.options));
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<vivid-menu-item
				icon="list-unordered"
				title="无序列表"
				:action="() => editorInstance.chain().focus().toggleBulletList().run()"
				:is-active="() => editorInstance.isActive('bulletList')"
			/>
		</slot>
	</div>
</template>

<style scoped></style>
