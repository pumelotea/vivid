import TaskList from "@tiptap/extension-task-list";
import {useTaskItem} from "./task-item.js";

export function useTaskList(){
	return [TaskList.configure({
		HTMLAttributes: {
			class: 'contains-task-list'
		}
	}),useTaskItem()]
}
