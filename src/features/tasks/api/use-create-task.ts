
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const createTaskEndpoint = client.api.tasks["$post"];
type ResponseType = InferResponseType<typeof createTaskEndpoint, 200>;
type RequestType = InferRequestType<typeof createTaskEndpoint>["json"];

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await createTaskEndpoint({ json });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      return await response.json();
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
  return mutation;
};
