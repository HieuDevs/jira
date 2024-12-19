import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export enum TaskPriority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export type Task = Models.Document & {
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  workspaceId: string;
  assigneeId: string[];
  dueDate: string;
};
