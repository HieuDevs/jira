
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const deleteTaskEndpoint = client.api.tasks[":taskId"]["$delete"];
type ResponseType = InferResponseType<typeof deleteTaskEndpoint, 200>;
type RequestType = InferRequestType<typeof deleteTaskEndpoint>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await deleteTaskEndpoint({ param });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
  return mutation;
};
