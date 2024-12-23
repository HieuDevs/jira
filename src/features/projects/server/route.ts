import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schemas";


import { TaskStatus } from "@/features/tasks/types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Project } from "../types";

const app = new Hono()
  .get("/",sessionMiddleware,zValidator("query",z.object({
    workspaceId: z.string()
  })), async (c) => {
    const { workspaceId } = c.req.valid("query");
    const user = c.get("user");
    const databases = c.get("databases");

    if (!workspaceId) {
      return c.json({
        error: "Workspace ID is required"
      }, 400);
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id
    });
    if (!member) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const projects = await databases.listDocuments<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      [
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("$createdAt")
      ]
    );
    return c.json({
      data: projects
    });
  })
  .get("/:projectId",sessionMiddleware,zValidator("param",z.object({
    projectId: z.string()
  })), async (c) => {
    const { projectId } = c.req.valid("param");
    const user = c.get("user");
    const databases = c.get("databases");
    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return c.json({ data: project });
  })
  .get("/:projectId/analytics",sessionMiddleware,zValidator("param",z.object({
    projectId: z.string()
  })), async (c) => {
    const {projectId} = c.req.valid("param")
    const user = c.get("user")
    const databases = c.get("databases")

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    )

    if (!project) {
      return c.json({error: "Missing project"}, 404)
    }

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
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
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthAssignedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthIncompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
  .post("/",sessionMiddleware,zValidator("form",createProjectSchema), async (c) => {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user")
        const {name, image, workspaceId} = c.req.valid("form")


        if (!workspaceId) {
          return c.json({
            error: "Workspace ID is required"
          }, 400);
        }

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id
        });
        if (!member) {
          return c.json({
            error: "Unauthorized"
          }, 401);
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
        }

        const project = await databases.createDocument(
          DATABASE_ID,
          PROJECTS_ID,
          ID.unique(),
          {
            name: name,
            imageUrl: uploadedImageUrl,
            workspaceId: workspaceId,
          }
        );

        return c.json({ data: project });
  })
  .patch(
    "/:projectId",
    zValidator("form", updateProjectSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user")
      const {projectId} = c.req.param()
      const {name, image} = c.req.valid("form")

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );
      if (!existingProject) {
        return c.json({ error: "Project not found" }, 404);
      }


      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id
      })

      if(!member) {
        return c.json({error: "Unauthorized to update this project"}, 401)
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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name: name,
          imageUrl: uploadedImageUrl,
        }
      );
      return c.json({ data: project });
    }
  )
  .delete(
    "/:projectId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user")
      const {projectId} = c.req.param()

      const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      )
      if(!project) {
        return c.json({error: "Project not found"}, 404)
      }

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId
      })

      if(!member) {
        return c.json({error: "Unauthorized to delete this workspace"}, 401)
      }

      //TODO: Delete tasks

      await databases.deleteDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      )
      return c.json({ data: { $id: projectId }});
    }
  )
export default app;

