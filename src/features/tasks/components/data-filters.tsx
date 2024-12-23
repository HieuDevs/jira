import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";

import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskPriority, TaskStatus } from "../types";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });
  const isLoading = isLoadingProjects || isLoadingMembers;
  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
    image: project.imageUrl,
  }));
  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { status, priority, projectId, assigneeId, search, dueDate },
    setFilters,
  ] = useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };
  const onPriorityChange = (value: string) => {
    setFilters({ priority: value === "all" ? null : (value as TaskPriority) });
  };
  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };
  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };
  if (isLoading) return null;
  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select defaultValue={status ?? "all"} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={priority ?? "all"} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All priorities" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskPriority.CRITICAL}>Critical</SelectItem>
          <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
          <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
          <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? "all"}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              <div className="flex items-center gap-2">
                {/* <MemberAvatar className="size-6" name={member.label} /> */}
                {member.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? "all"}
          onValueChange={onProjectChange}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                <div className="flex items-center gap-2">
                  {/* <ProjectAvatar
                  image={project.image}
                  name={project.label}
                  className="size-6 rounded-full"
                /> */}
                  {project.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex gap-2">
        <DatePicker
          value={dueDate ? new Date(dueDate) : undefined}
          placeholder="Due date"
          className="h-8 w-full lg:w-auto"
          onChange={(date) =>
            setFilters({ dueDate: date ? date.toISOString() : null })
          }
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ dueDate: null })}
          className="h-8"
        >
          Reset due date
        </Button>
      </div>
    </div>
  );
};
