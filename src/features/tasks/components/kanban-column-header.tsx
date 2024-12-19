import { Button } from "@/components/ui/button";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { TaskStatus } from "../types";
interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className="size-4 text-purple-400" />,
  [TaskStatus.TODO]: <CircleIcon className="size-4 text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-4 text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: <CircleDotIcon className="size-4 text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheckIcon className="size-4 text-emerald-400" />,
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  return (
    <div className="px-2 oy-1.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {statusIconMap[board]}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <p className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs font-medium text-neutral-700">
          {taskCount}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-5"
        onClick={() => open()}
      >
        <PlusIcon className="size-5 text-neutral-500" />
      </Button>
    </div>
  );
};
