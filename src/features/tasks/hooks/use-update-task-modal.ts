import { parseAsString, useQueryState } from 'nuqs';


export const useUpdateTaskModal = () => {
  const [taskId, setTaskId] = useQueryState<string>("edit-task", parseAsString);
  const open = (taskId: string) => setTaskId(taskId);
  const close = () => setTaskId(null);
  return {
    taskId,
    open,
    close,
    setTaskId,
  }
}