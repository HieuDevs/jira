"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader, PlusIcon } from "lucide-react";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { columns } from "./columns";
import { DataFilters } from "./data-filters";
import { DataTable } from "./data-table";

const TaskViewSwitcher = () => {
  const [{ status, priority, projectId, assigneeId, search, dueDate }] =
    useTaskFilters();
  const { open } = useCreateTaskModal();

  const workspaceId = useWorkspaceId();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId: workspaceId,
    projectId: projectId,
    status: status,
    priority: priority,
    assigneeId: assigneeId,
    search: search,
    dueDate: dueDate,
  });
  return (
    <Tabs className="flex-1 w-full border rounded-lg" defaultValue="table">
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
            <DataFilters />
            <DottedSeparator className="my-4" />
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
