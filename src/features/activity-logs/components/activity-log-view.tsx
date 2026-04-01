"use client";

import { DatePicker } from "@/components/date-picker";
import { DottedSeparator } from "@/components/dotted-separator";
import { PageLoader } from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { format } from "date-fns";
import { ActivityAction, ActivityEntityType } from "../types";
import { useGetActivityLogs } from "../api/use-get-activity-logs";
import { useActivityLogFilters } from "../hooks/use-activity-log-filters";

export const ActivityLogView = () => {
  const workspaceId = useWorkspaceId();
  const [{ projectId, startDate, endDate }, setFilters] = useActivityLogFilters();
  const { data: projects } = useGetProjects({ workspaceId });
  const { data, isLoading } = useGetActivityLogs({
    workspaceId,
    projectId,
    startDate,
    endDate,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const logs = data?.documents ?? [];
  const totalLogs = logs.length;
  const taskLogs = logs.filter((log) => log.entityType === ActivityEntityType.TASK).length;
  const projectLogs = logs.filter((log) => log.entityType === ActivityEntityType.PROJECT).length;
  const createdLogs = logs.filter((log) => log.action === ActivityAction.CREATED).length;
  const updatedLogs = logs.filter((log) => log.action === ActivityAction.UPDATED).length;
  const deletedLogs = logs.filter((log) => log.action === ActivityAction.DELETED).length;
  const getActionClassName = (action: ActivityAction) => {
    if (action === ActivityAction.CREATED) {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    if (action === ActivityAction.UPDATED) {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }
    return "border-rose-200 bg-rose-50 text-rose-700";
  };
  const getDescription = (description: string, projectName?: string | null) => {
    if (!projectName) {
      return description;
    }
    return description.replace(/ from project [a-zA-Z0-9]+$/i, ` from project "${projectName}"`);
  };

  return (
    <div className="h-full border rounded-lg p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Total logs</p>
          <p className="text-lg font-semibold">{totalLogs}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Created</p>
          <p className="text-lg font-semibold">{createdLogs}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Updated</p>
          <p className="text-lg font-semibold">{updatedLogs}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Deleted</p>
          <p className="text-lg font-semibold">{deletedLogs}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Task logs</p>
          <p className="text-lg font-semibold">{taskLogs}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Project logs</p>
          <p className="text-lg font-semibold">{projectLogs}</p>
        </div>
      </div>
      <DottedSeparator className="my-4" />
      <div className="flex flex-col gap-2 lg:flex-row">
        <Select
          defaultValue={projectId ?? "all"}
          onValueChange={(value) =>
            setFilters({ projectId: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full lg:w-[220px] h-9">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects?.documents.map((project) => (
              <SelectItem key={project.$id} value={project.$id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          value={startDate ? new Date(startDate) : undefined}
          placeholder="Start date"
          className="h-9 w-full lg:w-auto"
          onChange={(date) => setFilters({ startDate: date.toISOString() })}
        />
        <DatePicker
          value={endDate ? new Date(endDate) : undefined}
          placeholder="End date"
          className="h-9 w-full lg:w-auto"
          onChange={(date) => setFilters({ endDate: date.toISOString() })}
        />
        <Button
          variant="outline"
          className="h-9"
          onClick={() =>
            setFilters({ projectId: null, startDate: null, endDate: null })
          }
        >
          Reset filters
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length ? (
              logs.map((log) => (
                <TableRow key={log.$id}>
                  <TableCell>{format(new Date(log.$createdAt), "PPpp")}</TableCell>
                  <TableCell>{log.actorName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getActionClassName(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.entityType}: {log.entityName}
                  </TableCell>
                  <TableCell>{getDescription(log.description, log.projectName)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No activity logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
