import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetActivityLogsProps {
  workspaceId: string;
  projectId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export const useGetActivityLogs = ({
  workspaceId,
  projectId,
  startDate,
  endDate,
}: UseGetActivityLogsProps) => {
  return useQuery({
    queryKey: ["activity-logs", workspaceId, projectId, startDate, endDate],
    queryFn: async () => {
      const response = await client.api["activity-logs"]["$get"]({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          startDate: startDate ?? undefined,
          endDate: endDate ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activity logs");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
