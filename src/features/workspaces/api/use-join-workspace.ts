
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";


const joinWorkspaceEndpoint = client.api.workspaces[":workspaceId"]["join"]["$post"];
type ResponseType = InferResponseType<typeof joinWorkspaceEndpoint, 200>;
type RequestType = InferRequestType<typeof joinWorkspaceEndpoint>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param, json}) => {
      const response = await joinWorkspaceEndpoint({param, json});
      if (!response.ok) {
        throw new Error("Failed to join workspace");
      }
      return await response.json();
    },
    onSuccess: async ({data}) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
      toast.success("Joined workspace successfully");
    },
    onError: () => {
      toast.error("Failed to join workspace");
    },
  });
  return mutation;
};
