import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import {mergeAttributes} from "@tiptap/core";

export function useTable(options){
	const extensions = []
	extensions.push(Table.configure(options))
	extensions.push(TableRow)
	extensions.push(TableHeader)
	const HbTableCell = TableCell.extend({
		renderHTML ({ HTMLAttributes }) {
			const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
			if (attrs.colwidth) {
				attrs.style = `width: ${attrs.colwidth}px`
			}
			return [ 'td', attrs, 0 ]
		},
		addAttributes () {
			return {
				...this.parent?.(),
				// 添加新的属性
				backgroundColor: {
					default   : null,
					parseHTML : (element) => element.getAttribute('data-background-color'),
					renderHTML: (attributes) => ({
						'data-background-color': attributes.backgroundColor,
						style                  : `background-color: ${attributes.backgroundColor}`
					})
				}
			}
		}
	})
	extensions.push(HbTableCell)
	return extensions
}
