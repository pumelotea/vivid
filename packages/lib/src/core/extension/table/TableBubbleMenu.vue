<script setup>
	import { computed, inject } from "vue";
	import { NSpace } from "naive-ui";
	import VividMenuItem from "../../../core/components/VividMenuItem.vue";
	import { CellSelection } from "prosemirror-tables";

	const editorInstance = inject("editorInstance");

	const analyzeCellSelection = (editor) => {
		const selection = editor.state.selection;
		if (selection instanceof CellSelection) {
			let cellCount = 0;
			let mergedCellCount = 0;
			selection.forEachCell((cell) => {
				cellCount++;
				if (cell.attrs.colspan > 1 || cell.attrs.rowspan > 1) {
					mergedCellCount++;
				}
			});
			return {
				isRowSelection: selection.isRowSelection(),
				isColSelection: selection.isColSelection(),
				cellCount,
				mergedCellCount,
			};
		}
		return null;
	};

	const state = computed(() => {
		return analyzeCellSelection(editorInstance.value);
	});
</script>

<template>
	<div v-if="editorInstance && state" class="table-bubble-menu">
		<n-space :size="2">
			<vivid-menu-item
				v-if="state.cellCount > 1"
				icon="merge-cells-horizontal"
				title="合并单元格"
				:action="() => editorInstance.chain().focus().mergeOrSplit().run()"
			/>
			<vivid-menu-item
				v-if="state.mergedCellCount > 0"
				icon="split-cells-horizontal"
				title="拆分单元格"
				:action="() => editorInstance.chain().focus().mergeOrSplit().run()"
			/>
			<vivid-menu-item
				icon="insert-row-top"
				title="上面添加一行"
				:action="() => editorInstance.chain().focus().addRowBefore().run()"
			/>
			<vivid-menu-item
				icon="insert-row-bottom"
				title="下面添加一行"
				:action="() => editorInstance.chain().focus().addRowAfter().run()"
			/>
			<vivid-menu-item
				icon="insert-column-left"
				title="左边添加一列"
				:action="() => editorInstance.chain().focus().addColumnBefore().run()"
			/>
			<vivid-menu-item
				icon="insert-column-right"
				title="右边添加一列"
				:action="() => editorInstance.chain().focus().addColumnAfter().run()"
			/>
			<vivid-menu-item
				v-if="state.isRowSelection && !state.isColSelection"
				icon="delete-row"
				title="删除行"
				:action="() => editorInstance.chain().focus().deleteRow().run()"
			/>
			<vivid-menu-item
				v-if="state.isColSelection && !state.isRowSelection"
				icon="delete-column"
				title="删除列"
				:action="() => editorInstance.chain().focus().deleteColumn().run()"
			/>
			<vivid-menu-item
				v-if="state.isColSelection && state.isRowSelection"
				icon="delete-bin-6-line"
				title="删除表格"
				:action="() => editorInstance.chain().focus().deleteTable().run()"
			/>
		</n-space>
	</div>
</template>
