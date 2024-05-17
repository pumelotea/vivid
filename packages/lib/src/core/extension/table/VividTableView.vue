<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import * as pm from 'prosemirror-tables'
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	onUpdated,
	ref,
	toRaw,
	unref,
} from 'vue'
import { NPopover, NButton, useThemeVars } from 'naive-ui'
import ControlButton from './ControlButton.vue'
import { CellSelection } from 'prosemirror-tables'
import { useMutationObserver } from '@vueuse/core'
import { NodeSelection } from 'prosemirror-state'
import TableBubbleMenu from './TableBubbleMenu.vue'

const vars = useThemeVars()
const props = defineProps(nodeViewProps)

const rowSelected = ref(-1)
const colSelected = ref(-1)
const allSelected = ref(false)
const isFocus = ref(false)
const widths = ref([])
const heights = ref([])
const TableWrapper = ref()
const isOverflowingLeft = ref(false)
const isOverflowingRight = ref(false)

function resetSelected() {
	nextTick(() => {
		rowSelected.value = -1
		colSelected.value = -1
		allSelected.value = false
		isHover.value = false
	})
}

function getOverflowSide(element, container) {
	const rect = element.getBoundingClientRect()
	const containerRect = container.getBoundingClientRect()
	const isOverflowingLeft =
		Math.round(rect.left) < Math.round(containerRect.left)
	const isOverflowingRight =
		Math.round(rect.right) > Math.round(containerRect.right)
	return {
		isOverflowingLeft,
		isOverflowingRight,
	}
}

function updateShadow() {
	const r = getOverflowSide(TableWrapper.value.children[1], TableWrapper.value)
	isOverflowingRight.value = r.isOverflowingRight
	isOverflowingLeft.value = r.isOverflowingLeft
}

function updateFunc(updateColumnsOnResize = false) {
	const dom = props.editor.view.nodeDOM(props.getPos())
	const tableDOM = dom.querySelector('table')
	const colgroup = tableDOM.querySelector('colgroup')
	if (updateColumnsOnResize) {
		pm.updateColumnsOnResize(props.node, colgroup, tableDOM, 15)
	}

	// 获取宽度
	widths.value = []
	for (let child of colgroup.children) {
		widths.value.push(child.getBoundingClientRect().width)
	}

	// 获取高度
	heights.value = []
	for (const row of tableDOM.rows) {
		heights.value.push(row.getBoundingClientRect().height)
	}
	// console.log('heights',heights, 'widths',widths)
	// 检测左右2侧是否覆盖
	updateShadow()
}

function handleTableScroll() {
	updateShadow()
}

function useRefresh() {
	let isStop = false

	function refresh() {
		requestAnimationFrame(() => {
			if (isStop) {
				return
			}
			updateFunc()
			refresh()
		})
	}

	return {
		stop: () => {
			isStop = true
		},
		start: () => {
			isStop = false
			refresh()
		},
	}
}

const { stop, start } = useRefresh()

function onmousedown() {
	start()
	document.addEventListener('mouseup', onmouseup)
}

function onmouseup() {
	stop()
	document.removeEventListener('mouseup', onmouseup)
}

function chunkArray(array, chunkSize) {
	const chunks = []
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize))
	}
	return chunks
}

function checkEqualityWithAdjacent(matrix, index, isColumn, isNext) {
	// 获取行数或列数
	const rowCount = matrix.length
	const columnCount = matrix[0].length

	// 检查索引是否越界
	if (isColumn && (index < 0 || index >= columnCount)) {
		throw new Error('Column index out of bounds')
	} else if (!isColumn && (index < 0 || index >= rowCount)) {
		throw new Error('Row index out of bounds')
	}

	// 计算相邻索引
	const adjacentIndex = isNext ? index + 1 : index - 1

	// 检查相邻索引是否越界
	if (
		(isColumn && (adjacentIndex < 0 || adjacentIndex >= columnCount)) ||
		(!isColumn && (adjacentIndex < 0 || adjacentIndex >= rowCount))
	) {
		// 如果越界，返回当前索引的元素值
		return isColumn ? matrix[0][index] : matrix[index][0]
	}

	// 遍历行或列的每个元素
	for (let i = 0; i < (isColumn ? rowCount : columnCount); i++) {
		// 获取当前元素和相邻元素
		const currentElement = isColumn ? matrix[i][index] : matrix[index][i]
		const adjacentElement = isColumn
			? matrix[i][adjacentIndex]
			: matrix[adjacentIndex][i]

		// 比较当前元素和相邻元素
		if (currentElement !== adjacentElement) {
			// 如果找到不等的元素，返回那个不等的元素值
			return currentElement
		}
	}

	// 如果所有元素都相等，返回最后一个元素的值
	return isColumn ? matrix[rowCount - 1][index] : matrix[index][columnCount - 1]
}

function addCol(index, side) {
	const map = pm.TableMap.get(props.node)
	const matrix = chunkArray(map.map, map.width)
	const pos = checkEqualityWithAdjacent(matrix, index, true, side === 1)
	const rect = map.findCell(pos)
	props.editor.commands.addColumn(
		{
			map,
			table: toRaw(props.node),
			...rect,
			tableStart: props.getPos() + 1,
		},
		side ? rect.right : rect.left
	)
	resetSelected()
}

function addRow(index, side) {
	const map = pm.TableMap.get(props.node)
	const matrix = chunkArray(map.map, map.width)
	const pos = checkEqualityWithAdjacent(matrix, index, false, side === 1)
	const rect = map.findCell(pos)
	props.editor.commands.addRow(
		{
			map,
			table: toRaw(props.node),
			...rect,
			tableStart: props.getPos() + 1,
		},
		side ? rect.bottom : rect.top
	)
	resetSelected()
}

function deleteTable() {
	const node = toRaw(props.node)
	const pos = props.getPos()
	props.editor.commands.deleteTableAtPos(pos, pos + node.nodeSize)
}

const selectColumn = (col) => {
	const tablePos = props.getPos()
	const { width, height, map } = pm.TableMap.get(props.node)
	const first = tablePos + map[col] + 1
	const last = tablePos + map[width * (height - 1) + col] + 1
	const selection = CellSelection.create(props.editor.state.tr.doc, first, last)
	props.editor.view.dispatch(props.editor.state.tr.setSelection(selection))
	allSelected.value = false
	rowSelected.value = -1
	colSelected.value = col
}

const selectTable = () => {
	rowSelected.value = -1
	colSelected.value = -1
	allSelected.value = true
	props.editor.chain().setNodeSelection(props.getPos()).run()
}

const selectRow = (row) => {
	const map = pm.TableMap.get(props.node)
	const matrix = chunkArray(map.map, map.width)
	const rowArray = matrix[row]
	const selection = NodeSelection.create(
		props.editor.state.doc,
		rowArray[0] + props.getPos()
	)
	props.editor.view.dispatch(props.editor.state.tr.setSelection(selection))
	allSelected.value = false
	colSelected.value = -1
	rowSelected.value = row
}

onMounted(() => {
	updateFunc(true)
	TableWrapper.value.addEventListener('mousedown', onmousedown)
})

onUpdated(() => {
	updateFunc(true)
})

const isHover = ref(false)

function handelDeleteHover() {
	isHover.value = true
}

function handelDeleteLeave() {
	isHover.value = false
}

function deleteRow() {
	props.editor.chain().focus().deleteRow().run()
	resetSelected()
}

function deleteCol() {
	props.editor.chain().focus().deleteColumn().run()
	resetSelected()
}

const ViVidTable = ref()

const observer = useMutationObserver(
	ViVidTable,
	(mutations) => {
		if (!ViVidTable.value.$el.classList.contains('has-focus')) {
			resetSelected()
			isFocus.value = false
		}
		if (ViVidTable.value.$el.classList.contains('has-focus')) {
			isFocus.value = true
		}
	},
	{
		attributes: true,
	}
)

const showToolPop = computed(() => {
	const selection = props.editor.state.selection
	const isCell = selection instanceof CellSelection
	const isTable = selection.node?.type.name === 'table' || isCell // 选中表格或者单元格
	if (isTable && isFocus.value) {
		return true
	}
	return false
})

const resizeOb = new ResizeObserver(() => updateFunc(false))
unref(resizeOb).observe(props.editor.view.dom)
onBeforeUnmount(() => {
	observer.stop()
	unref(resizeOb).disconnect()
})
</script>

<template>
	<node-view-wrapper
		class="vivid-table"
		@click="resetSelected()"
		ref="ViVidTable"
		:class="{ deleteCell: isHover }"
	>
		<div
			class="table-box"
			:class="{
				'table-over-left-shadow': isOverflowingLeft,
				'table-over-right-shadow': isOverflowingRight,
			}"
		>
			<div class="table-bubble-container">
				<n-popover
					content-class="table-popover-color"
					:show-arrow="false"
					trigger="manual"
					raw
					:show="showToolPop"
					style="border-radius: 5px"
				>
					<template #trigger>
						<div></div>
					</template>
					<table-bubble-menu />
				</n-popover>
			</div>
			<div class="table-controller-left">
				<div class="table-controller-bar-v">
					<template v-for="(h, index) in heights" :key="index">
						<div
							:style="`height:${h}px`"
							class="bar-button-v"
							:data-h="h"
							v-if="h > 0"
							@click.stop="selectRow(index)"
						>
							<control-button
								vertical
								:active="rowSelected === index || allSelected"
								:show-delete-content="!allSelected"
								:offset="index === 0 || index === widths.length - 1 ? 0 : 50"
								:active-color="
									isHover ? 'rgba(255, 122, 139, 0.3)' : 'rgba(113,191,255,0.7)'
								"
							>
								<template v-slot:tool="{ isNext }">
									<n-button
										type="info"
										text
										@click.stop="addRow(index, isNext ? 1 : 0)"
									>
										<i class="ri-add-line"></i>
									</n-button>
								</template>
								<template #delete>
									<n-button
										type="error"
										text
										@click.stop="deleteRow"
										@mouseover="handelDeleteHover()"
										@mouseleave="handelDeleteLeave()"
									>
										<i class="ri-delete-bin-line"></i>
									</n-button>
								</template>
							</control-button>
						</div>
					</template>
				</div>
			</div>
			<n-popover
				:to="false"
				trigger="hover"
				:show="allSelected"
				:show-arrow="false"
				content-style="padding: 0;"
				style="
					padding: 0;
					width: 20px;
					height: 20px;
					display: flex;
					justify-content: center;
					align-items: center;
				"
			>
				<template #trigger>
					<div class="table-controller-bar-lt" @click.stop="selectTable">
						<div
							class="bar-button-all"
							:class="{ 'table-all-cell-selected': allSelected }"
						></div>
					</div>
				</template>
				<n-button
					type="error"
					text
					@click="deleteTable"
					@mouseover="handelDeleteHover()"
					@mouseleave="handelDeleteLeave()"
				>
					<i class="ri-delete-bin-line"></i>
				</n-button>
			</n-popover>
			<div class="table-wrapper" @scroll="handleTableScroll" ref="TableWrapper">
				<div class="table-controller-top">
					<div class="table-controller-bar-h">
						<template v-for="(w, index) in widths" :key="index">
							<div
								:style="`width:${w}px`"
								class="bar-button-h"
								:data-w="w"
								v-if="w > 0"
								@click.stop="selectColumn(index)"
							>
								<control-button
									:active="colSelected === index || allSelected"
									:show-delete-content="!allSelected"
									:offset="index === 0 || index === widths.length - 1 ? 0 : 50"
									:active-color="
										isHover
											? 'rgba(255, 122, 139, 0.3)'
											: 'rgba(113,191,255,0.7)'
									"
								>
									<template v-slot:tool="{ isNext }">
										<n-button
											type="info"
											text
											@click="addCol(index, isNext ? 1 : 0)"
										>
											<i class="ri-add-line"></i>
										</n-button>
									</template>
									<template #delete>
										<n-button
											type="error"
											text
											@click.stop="deleteCol"
											@mouseover="handelDeleteHover()"
											@mouseleave="handelDeleteLeave()"
										>
											<i class="ri-delete-bin-line"></i>
										</n-button>
									</template>
								</control-button>
							</div>
						</template>
					</div>
				</div>
				<table>
					<colgroup></colgroup>
					<node-view-content as="tbody"></node-view-content>
				</table>
			</div>
		</div>
	</node-view-wrapper>
</template>

<style>
.table-box {
	position: relative;
	max-width: 100%;
	padding-left: 15px;
	width: fit-content;
}

.table-wrapper {
	position: relative;
	box-sizing: border-box;
	margin-bottom: 0;
	overflow-x: auto;
	max-width: 100%;
	width: fit-content;
}

.table-wrapper::-webkit-scrollbar{
  display: none;
}

.table-wrapper table {
	margin: 40px 0 0;
}

.table-controller-top {
	height: 15px;
	position: absolute;
	left: 0;
	right: 0;
	top: 25px;
	width: fit-content;
	opacity: 0;
	z-index: 10;
}

.table-controller-left {
	width: 15px;
	position: absolute;
	left: 0;
	bottom: 0;
	top: 40px;
	height: fit-content;
	opacity: 0;
}

.bar-button-h {
	background: v-bind(vars.tabColor);
	border-width: 1px 0 1px 1px;
	border-style: solid;
	border-color: rgba(119, 110, 110, 0.2);
	cursor: pointer;
	box-sizing: border-box;
}

.bar-button-v {
	background: v-bind(vars.tabColor);
	border-width: 1px 1px 0 1px;
	border-style: solid;
	border-color: rgba(119, 110, 110, 0.2);
	cursor: pointer;
	box-sizing: border-box;
}

.table-controller-bar-lt {
	box-sizing: border-box;
	border: 1px solid rgba(119, 110, 110, 0.2);
	cursor: pointer;
	border-top-left-radius: 5px;
	position: absolute;
	left: 0;
	top: 25px;
	width: 15px;
	height: 15px;
	overflow: hidden;
	opacity: 0;
}

.bar-button-all {
	width: 100%;
	height: 100%;
	background: v-bind(vars.tabColor);
}

.table-controller-bar-h {
	height: 15px;
	display: flex;
	box-sizing: border-box;
	border-right: 1px solid;
	border-color: rgba(119, 110, 110, 0.2);
}

.vivid-table {
	max-width: 100%;
}

.vivid-table.has-focus .table-controller-top,
.vivid-table.has-focus .table-controller-left,
.vivid-table.has-focus .table-controller-bar-lt,
.vivid-table:hover .table-controller-top,
.vivid-table:hover .table-controller-left,
.vivid-table:hover .table-controller-bar-lt {
	opacity: 1;
}

.table-controller-bar-v {
	width: 15px;
	height: 100%;
	display: flex;
	box-sizing: border-box;
	flex-direction: column;
	border-bottom: 1px solid;
	border-color: rgba(119, 110, 110, 0.2);
}

.table-all-cell-selected {
	background: v-bind(vars.infoColorSuppl) !important;
}

.table-over-left-shadow {
}

.table-over-left-shadow:before {
	content: '';
	position: absolute;
	top: 40px;
	left: 15px;
	bottom: 0;
	width: 10px; /* 阴影宽度 */
	box-shadow: inset 10px 0px 10px -10px rgba(0, 0, 0, 0.2);
	z-index: 1;
}

.table-over-right-shadow {
}

.table-over-right-shadow:after {
	content: '';
	position: absolute;
	top: 40px;
	right: 0;
	bottom: 0;
	width: 10px; /* 阴影宽度 */
	z-index: 1; /* 确保伪元素在内容之上 */
	box-shadow: inset -10px 0 10px -10px rgba(0, 0, 0, 0.2);
}

.table-bubble-container {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: 0px;
}

.table-popover-color {
	border-radius: 3px;
	background: var(--n-color);
}
</style>
<style>
.editor-body th.selectedCell,
.editor-body td.selectedCell {
	background: v-bind(vars.infoColorSuppl);
	opacity: 0.2;
}

.editor-body .deleteCell th.selectedCell,
.editor-body .deleteCell td.selectedCell {
	background-color: rgba(255, 122, 139, 0.7);
}

.editor-body .deleteCell .table-all-cell-selected {
	background-color: rgba(255, 122, 139, 0.7) !important;
}
</style>
