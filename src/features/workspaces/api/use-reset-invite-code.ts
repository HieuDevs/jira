
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const resetInviteCodeEndpoint = client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"];
type ResponseType = InferResponseType<typeof resetInviteCodeEndpoint, 200>;
type RequestType = InferRequestType<typeof resetInviteCodeEndpoint>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await resetInviteCodeEndpoint({param});
      if (!response.ok) {
        throw new Error("Failed to reset invite code");
      }
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success("Invite code reset successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to reset invite code");
    },
  });
  return mutation;
};
