"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";
import { columns } from "./columns";
import { DataCalendar } from "./data-calendar";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./data-kanban";
import { DataTable } from "./data-table";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [{ status, priority, projectId, assigneeId, search, dueDate }] =
    useTaskFilters();
  const [view, setView] = useQueryState("view", {
    defaultValue: "table",
  });
  const { open } = useCreateTaskModal();
  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId: workspaceId,
    projectId: hideProjectFilter ? paramProjectId : projectId,
    status: status,
    priority: priority,
    assigneeId: assigneeId,
    search: search,
    dueDate: dueDate,
  });

  const handleKanbanChange = useCallback(
    (
      tasks: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[]
    ) => {
      bulkUpdateTasks({ json: { tasks } });
    },
    [bulkUpdateTasks]
  );

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="flex flex-col h-full p-4 overflow-auto">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="w-full h-8 lg:w-auto">
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="w-full h-8 lg:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="w-full h-8 lg:w-auto">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} className="w-full lg:w-auto" size="sm">
            <PlusIcon className="w-4 h-4" />
            New
          </Button>
        </div>
        {isLoadingTasks ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <>
            <DottedSeparator className="my-4" />
            <DataFilters hideProjectFilter={hideProjectFilter} />
            <DottedSeparator className="my-4" />
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={tasks?.documents ?? []}
                onChange={handleKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
