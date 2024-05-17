import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import VividTableView from './VividTableView.vue'
import { addColumn, addRow, selectedRect } from '@tiptap/pm/tables'

export function useTable(options) {
	if (!options) {
		options = {
			resizable: true,
		}
	}
	const extensions = []

	extensions.push(
		Table.extend({
			addNodeView() {
				return VueNodeViewRenderer(VividTableView)
			},
			addCommands() {
				return {
					...this.parent(),
					addColumn: (rect, col) => {
						return ({ state, dispatch }) => {
							dispatch(addColumn(state.tr, rect, col))
							return true
						}
					},
					addRow: (rect, row) => {
						return ({ state, dispatch }) => {
							dispatch(addRow(state.tr, rect, row))
							return true
						}
					},
					deleteTableAtPos: (start, end) => {
						return ({ state, dispatch }) => {
							dispatch(state.tr.delete(start, end).scrollIntoView())
							return false
						}
					},
				}
			},
		}).configure(options)
	)

	extensions.push(TableRow)
	extensions.push(TableHeader)
	//FIXME resize有bug
	const HbTableCell = TableCell.extend({
		renderHTML({ HTMLAttributes }) {
			const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
			if (attrs.colwidth) {
				attrs.style = `width: ${attrs.colwidth}px`
			}
			return ['td', attrs, 0]
		},
		addAttributes() {
			return {
				...this.parent?.(),
				// 添加新的属性
				backgroundColor: {
					default: null,
					parseHTML: (element) => element.getAttribute('data-background-color'),
					renderHTML: (attributes) => ({
						'data-background-color': attributes.backgroundColor,
						style: `background-color: ${attributes.backgroundColor}`,
					}),
				},
			}
		},
	})
	extensions.push(TableCell)
	return extensions
}
