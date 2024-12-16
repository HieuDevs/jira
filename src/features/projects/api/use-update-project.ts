
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const updateProjectEndpoint = client.api.projects[":projectId"]["$patch"];
type ResponseType = InferResponseType<typeof updateProjectEndpoint, 200>;
type RequestType = InferRequestType<typeof updateProjectEndpoint>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({form, param}) => {
      const response = await updateProjectEndpoint({form, param: {projectId: param.projectId}});
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
      return await response.json();
    },
    onSuccess: async ({data}) => {
      toast.success("Project updated successfully");
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
  return mutation;
};
