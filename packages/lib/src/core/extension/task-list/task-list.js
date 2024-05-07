import TaskList from "@tiptap/extension-task-list";

export function useTaskList(options){
	if (!options){
		options = {
			HTMLAttributes: {
				class: 'contains-task-list'
			}
		}
	}
	return TaskList.configure(options)
}
