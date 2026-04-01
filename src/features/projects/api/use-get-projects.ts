import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectsProps {
  workspaceId?: string;
}

export const useGetProjects = ({workspaceId}: UseGetProjectsProps) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
        if (!workspaceId) {
            return { documents: [], total: 0 };
        }
        const response = await client.api.projects["$get"]({
            query: {
                workspaceId
            }
        })
        if (!response.ok) {
            throw new Error("Failed to fetch projects")
        }
        const {data} = await response.json()
        return data
    },
  });
};
