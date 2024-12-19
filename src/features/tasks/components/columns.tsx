"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircleIcon,
  EllipsisIcon,
  EyeIcon,
  InboxIcon,
  ListTodoIcon,
  TimerIcon,
} from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "../types";
import { TaskActions } from "./task-actions";
import { TaskDate } from "./task-date";
export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowData = row.original;
      return <p className="line-clamp-1">{rowData.name}</p>;
    },
    sortingFn: (a, b) => {
      const aName = a.original.name;
      const bName = b.original.name;
      return aName.localeCompare(bName);
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            image={rowData.project.imageUrl}
            name={rowData.project.name}
            className="size-6"
          />
          <p className="line-clamp-1">{rowData.project.name}</p>
        </div>
      );
    },
    sortingFn: (a, b) => {
      const aProject = a.original.project;
      const bProject = b.original.project;
      return aProject.name.localeCompare(bProject.name);
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowData = row.original.assignee;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            name={rowData.name}
            fallbackClassName="text-xs"
            className="size-6"
          />
          <p className="line-clamp-1">{rowData.name}</p>
        </div>
      );
    },
    sortingFn: (a, b) => {
      const aAssignee = a.original.assignee;
      const bAssignee = b.original.assignee;
      return aAssignee.name.localeCompare(bAssignee.name);
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowData = row.original;
      return <TaskDate value={rowData.dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowData = row.original;
      const status = rowData.status;
      const titleCaseStatus = snakeCaseToTitleCase(status);
      const icon =
        status === TaskStatus.IN_REVIEW ? (
          <EyeIcon className="size-4" />
        ) : status === TaskStatus.DONE ? (
          <CheckCircleIcon className="size-4" />
        ) : status === TaskStatus.TODO ? (
          <ListTodoIcon className="size-4" />
        ) : status === TaskStatus.IN_PROGRESS ? (
          <TimerIcon className="size-4" />
        ) : (
          <InboxIcon className="size-4" />
        );
      return (
        <Badge variant={status} className="gap-x-2 text-sm">
          {icon}
          <span>{titleCaseStatus}</span>
        </Badge>
      );
    },
    sortingFn: (a, b) => {
      const aStatus = a.original.status;
      const bStatus = b.original.status;
      const statusOrder = {
        [TaskStatus.DONE]: 1,
        [TaskStatus.IN_REVIEW]: 2,
        [TaskStatus.IN_PROGRESS]: 3,
        [TaskStatus.TODO]: 4,
        [TaskStatus.BACKLOG]: 5,
      };

      return statusOrder[aStatus] - statusOrder[bStatus];
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowData = row.original;
      const priority = rowData.priority;
      return (
        <Badge variant={priority} className="text-sm">
          {snakeCaseToTitleCase(priority)}
        </Badge>
      );
    },
    sortingFn: (a, b) => {
      const aPriority = a.original.priority;
      const bPriority = b.original.priority;
      const priorityOrder = {
        [TaskPriority.CRITICAL]: 1,
        [TaskPriority.HIGH]: 2,
        [TaskPriority.MEDIUM]: 3,
        [TaskPriority.LOW]: 4,
      };
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <TaskActions id={row.original.$id} projectId={row.original.projectId}>
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
