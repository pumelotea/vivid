<script setup lang="ts">
	import { ref } from "vue";
	import { NSpace } from "naive-ui";
	import VividMenuItem from "../../../core/components/VividMenuItem.vue";
	import VividMathModal from "./VividMathModal.vue";
	import { useEditorInstance } from "@lib/core/extension/utils/common";

	const editorInstance = useEditorInstance();

	const HTM = ref<any>(null);

	function handleOpenMath() {
		const selection = editorInstance.value.state.selection as any;
		if (selection.node) {
			HTM.value.open(selection.node.attrs.tex);
		}
	}

	function deleteNode() {
		editorInstance.value.commands.deleteSelection();
	}

	function onok(val: string) {
		if (!val) {
			editorInstance.value.commands.deleteSelection();
			return;
		}
		const selection = editorInstance.value.state.selection;
		const editor = editorInstance.value;

		editor.commands.command(({ tr }) => {
			const pos = selection.from;
			tr.setNodeMarkup(pos, undefined, {
				tex: val,
			});
			return true;
		});
	}
</script>

<template>
	<div>
		<n-space :size="2">
			<vivid-menu-item
				icon="edit-box-line"
				title="修改公式"
				:action="handleOpenMath"
				:is-active="() => {}"
			/>
			<vivid-menu-item
				icon="delete-bin-2-line"
				title="删除"
				:action="deleteNode"
				:is-active="() => {}"
			/>
		</n-space>
		<vivid-math-modal ref="HTM" @ok="onok" />
	</div>
</template>
