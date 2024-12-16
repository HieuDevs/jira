import { z } from "zod";
import { TaskPriority, TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required",
  }),
  status: z.nativeEnum(TaskStatus, {
    required_error: "Status is required",
  }),
  priority: z.nativeEnum(TaskPriority, {
    required_error: "Priority is required",
  }),
  workspaceId: z.string({
    message: "Workspace ID is required",
  }),
  projectId: z.string({
    message: "Project ID is required",
  }),
  assigneeId: z.array(z.string(), {
    message: "Assignee ID is required",
  }),
  dueDate: z.date().optional(),
  description: z.string().optional(),
});
