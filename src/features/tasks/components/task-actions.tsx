import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteTask } from "../api/use-delete-task";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const { confirm, ConfirmationDialog } = useConfirm(
    "Are you sure you want to delete this task?",
    "This action cannot be undone.",
    "destructive"
  );
  const { open } = useUpdateTaskModal();

  const handleDeleteTask = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteTask({ param: { taskId: id } });
    }
  };

  const handleOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  const handleOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmationDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuItem
            onClick={handleOpenTask}
            disabled={isPending}
            className="font-medium p-2"
          >
            <ExternalLinkIcon className="size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenProject}
            disabled={isPending}
            className="font-medium p-2"
          >
            <ExternalLinkIcon className="size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            disabled={isPending}
            className="font-medium p-2"
          >
            <PencilIcon className="size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteTask}
            disabled={isPending}
            className="font-medium text-amber-700 focus:text-amber-700 selection:"
          >
            <TrashIcon className="size-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
