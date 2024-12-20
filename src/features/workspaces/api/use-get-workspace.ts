import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: UseGetWorkspaceProps) => {
  return useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => {
        const response = await client.api.workspaces[":workspaceId"]["$get"]({
            param: {
                workspaceId
            }
        })
        if (!response.ok) {
            throw new Error("Failed to fetch workspaces")
        }
        const {data} = await response.json()
        return data
    },
  });
};
