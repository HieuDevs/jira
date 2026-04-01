import { Models } from "node-appwrite";

export enum ActivityEntityType {
  TASK = "TASK",
  PROJECT = "PROJECT",
}

export enum ActivityAction {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
}

export type ActivityLog = Models.Document & {
  timestamp: string;
  workspaceId: string;
  projectId: string | null;
  projectName?: string | null;
  actorMemberId: string;
  actorName: string;
  entityType: ActivityEntityType;
  entityId: string;
  entityName: string;
  action: ActivityAction;
  description: string;
};
