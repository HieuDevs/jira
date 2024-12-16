
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const deleteProjectEndpoint = client.api.projects[":projectId"]["$delete"];
type ResponseType = InferResponseType<typeof deleteProjectEndpoint, 200>;
type RequestType = InferRequestType<typeof deleteProjectEndpoint>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await deleteProjectEndpoint({param: {projectId: param.projectId}});
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return await response.json();
    },
    onSuccess: async ({data}) => {
      toast.success("Project deleted successfully");
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
  return mutation;
};
