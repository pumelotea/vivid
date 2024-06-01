import OrderedList, { OrderedListOptions } from "@tiptap/extension-ordered-list";
import OrderedListExt from "./OrderedList.vue";

export function useOrderedList(options?: Partial<OrderedListOptions>) {
	return OrderedList.configure(options);
}

export { OrderedListExt };
