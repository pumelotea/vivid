import TaskList, { TaskListOptions } from "@tiptap/extension-task-list";

export function useTaskList(options?: Partial<TaskListOptions>) {
	if (!options) {
		options = {
			HTMLAttributes: {
				class: "contains-task-list",
			},
		};
	}
	return TaskList.configure(options);
}
