
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const deleteWorkspaceEndpoint = client.api.workspaces[":workspaceId"]["$delete"];
type ResponseType = InferResponseType<typeof deleteWorkspaceEndpoint, 200>;
type RequestType = InferRequestType<typeof deleteWorkspaceEndpoint>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await deleteWorkspaceEndpoint({param});
      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }
      return await response.json();
    },
    onSuccess: async ({data}) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
      toast.success("Workspace deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });
  return mutation;
};
