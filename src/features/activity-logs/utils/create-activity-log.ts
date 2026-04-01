import { ACTIVITY_LOGS_ID, DATABASE_ID } from "@/config";
import {
  ActivityAction,
  ActivityEntityType,
  ActivityLog,
} from "@/features/activity-logs/types";
import { createAdminClient } from "@/lib/appwrite";
import { Databases, ID } from "node-appwrite";

interface CreateActivityLogProps {
  databases: Databases;
  workspaceId: string;
  projectId?: string | null;
  actorMemberId: string;
  actorName: string;
  entityType: ActivityEntityType;
  entityId: string;
  entityName: string;
  action: ActivityAction;
  description: string;
}

export const createActivityLog = async ({
  databases,
  workspaceId,
  projectId = null,
  actorMemberId,
  actorName,
  entityType,
  entityId,
  entityName,
  action,
  description,
}: CreateActivityLogProps) => {
  void databases;
  const { databases: adminDatabases } = await createAdminClient();
  await adminDatabases.createDocument<ActivityLog>(
    DATABASE_ID,
    ACTIVITY_LOGS_ID,
    ID.unique(),
    {
      timestamp: new Date().toISOString(),
      workspaceId,
      projectId,
      actorMemberId,
      actorName,
      entityType,
      entityId,
      entityName,
      action,
      description,
    }
  );
};
