
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const updateTaskEndpoint = client.api.tasks[":taskId"]["$patch"];
type ResponseType = InferResponseType<typeof updateTaskEndpoint, 200>;
type RequestType = InferRequestType<typeof updateTaskEndpoint>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json, param: {taskId}}) => {
      const response = await updateTaskEndpoint({ json, param: { taskId } });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Task updated successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
  return mutation;
};
