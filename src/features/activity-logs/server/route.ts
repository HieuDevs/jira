import { ACTIVITY_LOGS_ID, DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { z } from "zod";
import { ActivityLog } from "../types";

const app = new Hono().get(
  "/",
  sessionMiddleware,
  zValidator(
    "query",
    z.object({
      workspaceId: z.string(),
      projectId: z.string().nullish(),
      startDate: z.string().datetime().nullish(),
      endDate: z.string().datetime().nullish(),
    })
  ),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { databases: adminDatabases } = await createAdminClient();
    const { workspaceId, projectId, startDate, endDate } = c.req.valid("query");

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const query = [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")];

    if (projectId) {
      query.push(Query.equal("projectId", projectId));
    }
    if (startDate) {
      query.push(Query.greaterThanEqual("$createdAt", startDate));
    }
    if (endDate) {
      query.push(Query.lessThanEqual("$createdAt", endDate));
    }

    const logs = await adminDatabases.listDocuments<ActivityLog>(
      DATABASE_ID,
      ACTIVITY_LOGS_ID,
      query
    );

    const projectIds = [...new Set(logs.documents.map((log) => log.projectId).filter(Boolean))] as string[];
    const projects = projectIds.length
      ? await adminDatabases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
          Query.contains("$id", projectIds),
        ])
      : { documents: [] };
    const projectNameById = new Map(projects.documents.map((project) => [project.$id, project.name]));
    const logsWithProjectName = logs.documents.map((log) => ({
      ...log,
      projectName: log.projectId ? (projectNameById.get(log.projectId) ?? null) : null,
    }));

    return c.json({ data: { ...logs, documents: logsWithProjectName } });
  }
);

export default app;
