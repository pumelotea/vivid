import History from "@tiptap/extension-history";
import HistoryExt from "./History.vue";

export function useHistory(options){
	return History.configure(options)
}

export {
	HistoryExt
}
