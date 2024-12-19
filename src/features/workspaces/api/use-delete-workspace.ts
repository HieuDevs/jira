
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const deleteWorkspaceEndpoint = client.api.workspaces[":workspaceId"]["$delete"];
type ResponseType = InferResponseType<typeof deleteWorkspaceEndpoint, 200>;
type RequestType = InferRequestType<typeof deleteWorkspaceEndpoint>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await deleteWorkspaceEndpoint({param});
      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Workspace deleted successfully");
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });
  return mutation;
};
