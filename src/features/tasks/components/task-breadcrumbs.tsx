import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { ChevronRight, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteTask } from "../api/use-delete-task";
import { Task } from "../types";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const { confirm, ConfirmationDialog } = useConfirm(
    "Delete task",
    "Are you sure you want to delete this task?",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteTask(
        {
          param: { taskId: task.$id },
        },
        {
          onSuccess: () => {
            router.push(`/workspaces/${workspaceId}/tasks`);
          },
        }
      );
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmationDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg text-muted-foreground hover:opacity-75 transition-opacity font-semibold">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        variant="destructive"
        className="ml-auto"
        size="sm"
        onClick={handleDeleteTask}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
        <span className="hidden lg:block">Delete task</span>
      </Button>
    </div>
  );
};
