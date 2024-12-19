
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const loginEndpoint = client.api.auth.login["$post"];
type ResponseType = InferResponseType<typeof loginEndpoint, 200>;
type RequestType = InferRequestType<typeof loginEndpoint>["json"];

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await loginEndpoint({json});
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to login");
    },
  });
  return mutation;
};
