import ListItem, { ListItemOptions } from "@tiptap/extension-list-item";
import ListItemExt from "./ListItem.vue";

export function useListItem(options?: Partial<ListItemOptions>) {
	return ListItem.configure(options);
}

export { ListItemExt };
