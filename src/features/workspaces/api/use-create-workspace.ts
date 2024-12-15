
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const createWorkspaceEndpoint = client.api.workspaces["$post"];
type ResponseType = InferResponseType<typeof createWorkspaceEndpoint, 200>;
type RequestType = InferRequestType<typeof createWorkspaceEndpoint>["form"];

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await createWorkspaceEndpoint({form});
      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }
      return await response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace created successfully");
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });
  return mutation;
};
