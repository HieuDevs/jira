
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const updateWorkspaceEndpoint = client.api.workspaces[":workspaceId"]["$patch"];
type ResponseType = InferResponseType<typeof updateWorkspaceEndpoint, 200>;
type RequestType = InferRequestType<typeof updateWorkspaceEndpoint>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({form, param}) => {
      const response = await updateWorkspaceEndpoint({form, param});
      if (!response.ok) {
        throw new Error("Failed to update workspace");
      }
      return await response.json();
    },
    onSuccess: async ({data}) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
      toast.success("Workspace updated successfully");
    },
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });
  return mutation;
};
