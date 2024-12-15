

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const deleteMemberEndpoint = client.api.members[":memberId"]["$delete"];
type ResponseType = InferResponseType<typeof deleteMemberEndpoint, 200>;
type RequestType = InferRequestType<typeof deleteMemberEndpoint>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param}) => {
      const response = await deleteMemberEndpoint({param});
      if (!response.ok) {
        throw new Error("Failed to delete member");
      }
      return await response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete member");
    },
  });
  return mutation;
};
