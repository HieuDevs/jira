import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskPriority, TaskStatus } from "../types";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority | null;
  search?: string | null;
}

export const useGetTasks = ({workspaceId, projectId, status, assigneeId, dueDate, priority, search}: UseGetTasksProps) => {
  return useQuery({
    queryKey: ["tasks", workspaceId, projectId, status, assigneeId, dueDate, priority, search],
    queryFn: async () => {
      const response = await client.api.tasks["$get"]({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          priority: priority ?? undefined,
          search: search ?? undefined,
        },
      });
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
      const { data } = await response.json();
      return data;
    },
  });
};
