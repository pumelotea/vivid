import History, { HistoryOptions } from "@tiptap/extension-history";
import HistoryExt from "./History.vue";

export function useHistory(options?: Partial<HistoryOptions>) {
	return History.configure(options);
}

export { HistoryExt };
