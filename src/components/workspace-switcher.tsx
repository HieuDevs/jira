"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
export const WorkSpaceSwitcher = () => {
  const { data, isLoading } = useGetWorkspaces();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const handleWorkspaceChange = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };
  const { open } = useCreateWorkspaceModal();
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="text-neutral-500 size-5 cursor-pointer hover:opacity-75 transition"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-start">
          <Loader className="text-neutral-500 size-5 animate-spin" />
        </div>
      )}

      {!isLoading && data && (
        <Select onValueChange={handleWorkspaceChange} value={workspaceId}>
          <SelectTrigger className="w-full bg-neutral-200 font-medium p-2">
            <SelectValue placeholder="No workspaces selected" />
          </SelectTrigger>
          <SelectContent>
            {data.documents.map((workspace) => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex items-center gap-3 font-medium justify-start">
                  <WorkspaceAvatar
                    image={workspace.imageUrl}
                    name={workspace.name}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
