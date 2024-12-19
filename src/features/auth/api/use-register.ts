
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const registerEndpoint = client.api.auth.register["$post"];
type ResponseType = InferResponseType<typeof registerEndpoint, 200>;
type RequestType = InferRequestType<typeof registerEndpoint>["json"];

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await registerEndpoint({json});
      if (!response.ok) {
        throw new Error("Failed to register");
      }
      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
      toast.success("Registered successfully");
    },
    onError: () => {
      toast.error("Failed to register");
    },
  });
  return mutation;
};
