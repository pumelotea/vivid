import OrderedList from '@tiptap/extension-ordered-list'
import OrderedListExt from './OrderedList.vue'

export function useOrderedList(options) {
	return OrderedList.configure(options)
}

export { OrderedListExt }
