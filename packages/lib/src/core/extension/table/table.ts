import Table,{ TableOptions} from '@tiptap/extension-table'
import TableRow from './row'
import TableHeader from './header'
import TableCell from './cell'
export function useTable(options: Partial<TableOptions>) {
	if (!options) {
		options = {
			resizable: true,
		}
	}
	return Table.extend({
		addExtensions(){
			return [TableHeader,TableRow,TableCell]
		},
	}).configure(options)
}
