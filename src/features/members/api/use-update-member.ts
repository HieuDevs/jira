

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const updateMemberEndpoint = client.api.members[":memberId"]["$patch"];
type ResponseType = InferResponseType<typeof updateMemberEndpoint, 200>;
type RequestType = InferRequestType<typeof updateMemberEndpoint>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({param, json}) => {
      const response = await updateMemberEndpoint({param, json});
      if (!response.ok) {
        throw new Error("Failed to update member");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Failed to update member");
    },
  });
  return mutation;
};
