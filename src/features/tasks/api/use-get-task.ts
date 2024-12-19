import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetTaskProps {
  taskId: string;
}

export const useGetTask = ({taskId}: UseGetTaskProps) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: {
          taskId,
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