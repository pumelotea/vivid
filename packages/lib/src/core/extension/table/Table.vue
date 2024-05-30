<script setup>
import VividMenuItem from '../../components/VividMenuItem.vue'
import { inject, ref } from 'vue'
import { useTable } from './table.js'
import { NPopover, NSpace } from 'naive-ui'
import VividTableCreator from './VividTableCreator.vue'

const props = defineProps({
	options: {
		type: Object,
		required: false,
	},
})
const show = ref(false)
const editorInstance = inject('editorInstance')
const useExtension = inject('useExtension')
if (!useExtension) {
	throw new Error('Table component must under VividEditor menu slot')
}
useTable(props.options).map((e) => {
	useExtension(e)
})

function insertTable(r, c) {
	show.value = false
	editorInstance.value
		.chain()
		.focus()
		.insertTable({ rows: r, cols: c, withHeaderRow: true })
		.run()
}
</script>

<template>
	<div v-if="editorInstance">
		<slot>
			<n-space :size="2">
				<n-popover
            :z-index="99999"
					v-model:show="show"
					trigger="hover"
					placement="bottom"
					:show-arrow="false"
				>
					<template #trigger>
						<vivid-menu-item
							icon="table-2"
							title="插入表格"
							:action="() => {}"
						/>
					</template>
					<vivid-table-creator @insert="insertTable" />
				</n-popover>
				<!--        <vivid-menu-item-->
				<!--            icon="delete-bin-6-line"-->
				<!--            title="删除表格"-->
				<!--            :action="() => editorInstance.chain().focus().deleteTable().run()"-->
				<!--        />-->
				<!--        <vivid-menu-item-->
				<!--            icon="merge-cells-horizontal"-->
				<!--            title="合并拆分单元格"-->
				<!--            :action="() => editorInstance.chain().focus().mergeOrSplit().run()"-->
				<!--        />-->
				<!--        <vivid-menu-item-->
				<!--            icon="insert-row-top"-->
				<!--            title="上面添加一行"-->
				<!--            :action="() => editorInstance.chain().focus().addRowBefore().run()"-->
				<!--        />-->
				<!--        <vivid-menu-item-->
				<!--            icon="insert-row-bottom"-->
				<!--            title="下面添加一行"-->
				<!--            :action="() => editorInstance.chain().focus().addRowAfter().run()"-->
				<!--        />-->
				<!--        <vivid-menu-item-->
				<!--            icon="delete-row"-->
				<!--            title="删除行"-->
				<!--            :action="() => editorInstance.chain().focus().deleteRow().run()"-->
				<!--        />-->
				<!--        <vivid-menu-item-->
				<!--            icon="insert-column-left"-->
				<!--            title="左边添加一列"-->
				<!--            :action="() => editorInstance.chain().focus().addColumnBefore().run()"-->
				<!--        />-->
				<!--        <vivid-menu-item-->
				<!--            icon="insert-column-right"-->
				<!--            title="右边添加一列"-->
				<!--            :action="() => editorInstance.chain().focus().addColumnAfter().run()"-->
				<!--        />-->
				<!--        <vivid-menu-item-->
				<!--            icon="delete-column"-->
				<!--            title="删除行"-->
				<!--            :action="() => editorInstance.chain().focus().deleteColumn().run()"-->
				<!--        />-->
			</n-space>
		</slot>
	</div>
</template>

<style scoped></style>
