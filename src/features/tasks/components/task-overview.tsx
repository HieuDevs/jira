import { DottedSeparator } from "@/components/dotted-separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { Task } from "../types";
import { OverviewProperty } from "./overview-property";
import { TaskDate } from "./task-date";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useUpdateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Overview</h2>
          <Button
            size="sm"
            variant="secondary"
            className="ml-auto"
            onClick={() => {
              open(task.$id);
            }}
          >
            <PencilIcon className="size-4" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignees[0]?.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignees[0]?.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
          <OverviewProperty label="Priority">
            <Badge variant={task.priority}>
              {snakeCaseToTitleCase(task.priority)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
