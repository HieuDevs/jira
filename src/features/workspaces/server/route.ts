import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, TASKS_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";
import { startOfMonth } from "date-fns";
import { endOfMonth } from "date-fns";
import { subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("userId", user.$id)]
    )
    if(members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId)
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspaceIds)
      ]
    )
    return c.json({ data: workspaces });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();
    const user = c.get("user");
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId
    })
    if(!member) {
      return c.json({error: "Unauthorized"}, 401)
    }
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return c.json({ data: workspace });
  })
  .get("/:workspaceId/analytics",sessionMiddleware,zValidator("param",z.object({
    workspaceId: z.string()
  })), async (c) => {
    const {workspaceId} = c.req.valid("param")
    const user = c.get("user")
    const databases = c.get("databases")

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id
    })

    if (!member) {
      return c.json({error: "Unauthorized"}, 401)
    }

    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const taskCount = thisMonthTasks.total
    const lastMonthTaskCount = lastMonthTasks.total

    const taskDiff = taskCount - lastMonthTaskCount

    const thisMonthAssignedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthAssignedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )
    const assignedTaskCount = thisMonthAssignedTask.total
    const lastMonthAssignedTaskCount = lastMonthAssignedTask.total
    const assignedTaskDiff = assignedTaskCount - lastMonthAssignedTaskCount

    const thisMonthIncompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthIncompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const incompleteTaskCount = thisMonthIncompleteTask.total
    const lastMonthIncompleteTaskCount = lastMonthIncompleteTask.total
    const incompleteTaskDiff = incompleteTaskCount - lastMonthIncompleteTaskCount

    const thisMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const completedTaskCount = thisMonthCompletedTask.total
    const lastMonthCompletedTaskCount = lastMonthCompletedTask.total
    const completedTaskDiff = completedTaskCount - lastMonthCompletedTaskCount

    const thisMonthOverdueTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthOverdueTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", lastMonthEnd.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const overdueTaskCount = thisMonthOverdueTask.total
    const lastMonthOverdueTaskCount = lastMonthOverdueTask.total
    const overdueTaskDiff = overdueTaskCount - lastMonthOverdueTaskCount

    return c.json({
      data: {
        taskCount,
        taskDiff,
        assignedTaskCount,
        assignedTaskDiff,
        incompleteTaskCount,
        incompleteTaskDiff,
        completedTaskCount,
        completedTaskDiff,
        overdueTaskCount,
        overdueTaskDiff
      }
    })
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user")
      const {name, image} = c.req.valid("form")
      let uploadedImageUrl: string | undefined
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        )
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id,
        )
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
        // uploadedImageUrl = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!+`/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name: name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        }
      );
      await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        }
      );
      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user")
      const {workspaceId} = c.req.param()
      const {name, image} = c.req.valid("form")

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })
      if(!member || member.role !== MemberRole.ADMIN) {
        return c.json({error: "Unauthorized to update this workspace"}, 401)
      }

      let uploadedImageUrl: string | undefined
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        )
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id,
        )
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
        // uploadedImageUrl = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!+`/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
      } else{
        uploadedImageUrl = image
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name: name,
          imageUrl: uploadedImageUrl,
        }
      );
      return c.json({ data: workspace });
    }
  )
  .delete(
    "/:workspaceId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user")
      const {workspaceId} = c.req.param()
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })

      if(!member || member.role !== MemberRole.ADMIN) {
        return c.json({error: "Unauthorized to delete this workspace"}, 401)
      }

      //TODO: Delete members, projects and tasks

      await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId)
      return c.json({ data: { $id: workspaceId }});
    }
  )
  .post(
    "/:workspaceId/reset-invite-code",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user")
      const {workspaceId} = c.req.param()

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })
      if(!member || member.role !== MemberRole.ADMIN) {
        return c.json({error: "Unauthorized to update this workspace"}, 401)
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          inviteCode: generateInviteCode(6),
        }
      );
      return c.json({ data: workspace });
    }
  )
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({
      code: z.string()
    })),
    async (c) => {
      const {workspaceId} = c.req.param()
      const {code} = c.req.valid("json")
      const databases = c.get("databases");
      const user = c.get("user")

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })
      if(member) {
        return c.json({error: "Already a member of this workspace"}, 400)
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      )
      if(!workspace) {
        return c.json({error: "Workspace not found"}, 404)
      }
      if(workspace.inviteCode !== code) {
        return c.json({error: "Invalid invite code"}, 400)
      }

      await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId: workspaceId,
          role: MemberRole.MEMBER,
        }
      );

      return c.json({ data: workspace });
    }
  );
export default app;

