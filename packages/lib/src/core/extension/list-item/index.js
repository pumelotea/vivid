import ListItem from '@tiptap/extension-list-item'
import ListItemExt from './ListItem.vue'

export function useListItem(options) {
	return ListItem.configure(options)
}

export { ListItemExt }
