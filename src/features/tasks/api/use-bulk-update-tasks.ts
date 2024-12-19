
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const bulkUpdateTasksEndpoint = client.api.tasks["bulk-update"]["$post"];
type ResponseType = InferResponseType<typeof bulkUpdateTasksEndpoint, 200>;
type RequestType = InferRequestType<typeof bulkUpdateTasksEndpoint>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json}) => {
      const response = await bulkUpdateTasksEndpoint({ json });
      if (!response.ok) {
        throw new Error("Failed to update tasks");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tasks updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to update tasks");
    },
  });
  return mutation;
};
