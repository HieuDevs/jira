import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { createActivityLog } from "@/features/activity-logs/utils/create-activity-log";
import { getMember } from '@/features/members/utils';
import { Project } from '@/features/projects/types';
import { createTaskSchema, updateTaskSchema } from "@/features/tasks/schemas";
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from '@hono/zod-validator';
import { Hono } from "hono";
import { ID, Query } from 'node-appwrite';
import { z } from "zod";
import { ActivityAction, ActivityEntityType } from "../../activity-logs/types";
import { Task, TaskPriority, TaskStatus } from '../types';

const app = new Hono()
    .patch(
        "/:taskId",
        sessionMiddleware,
        zValidator("json",updateTaskSchema),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const {name,status,workspaceId,projectId,assigneeId,priority,dueDate,description} = c.req.valid("json");
            if (!workspaceId) {
                return c.json({error: "Missing the workspace"},400);
            }
            if (!projectId) {
                return c.json({error: "Missing the project"},400);
            }
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId: workspaceId,
            });
            if(!member) {
                return c.json({error: "Unauthorized"},401);
            }

            const {taskId} = c.req.param();
            const existingTask = await databases.getDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                taskId
            );
            const [existingProject, updatedProject] = await Promise.all([
                databases.getDocument<Project>(
                    DATABASE_ID,
                    PROJECTS_ID,
                    existingTask.projectId
                ),
                databases.getDocument<Project>(
                    DATABASE_ID,
                    PROJECTS_ID,
                    projectId
                ),
            ]);
            const task = await databases.updateDocument(
                DATABASE_ID,
                TASKS_ID,
                taskId,
                {
                    name,
                    status,
                    workspaceId,
                    projectId,
                    assigneeId,
                    dueDate,
                    description,
                    ...(priority && { priority: priority.toUpperCase() }),
                }
            );
            const updatedPriority = priority ? priority.toUpperCase() : existingTask.priority;
            const updatedDueDate = dueDate ?? existingTask.dueDate;
            const updatedAssigneeIds = assigneeId ?? existingTask.assigneeId;
            const changeParts: string[] = [];
            if (existingTask.name !== name) changeParts.push(`name "${existingTask.name}" -> "${name}"`);
            if (existingTask.status !== status) changeParts.push(`status ${existingTask.status} -> ${status}`);
            if (existingTask.projectId !== projectId) {
                changeParts.push(`project "${existingProject.name}" -> "${updatedProject.name}"`);
            }
            if (existingTask.dueDate !== updatedDueDate) changeParts.push(`dueDate ${existingTask.dueDate} -> ${updatedDueDate}`);
            if (existingTask.description !== description) changeParts.push(`description updated`);
            if (existingTask.priority !== updatedPriority) changeParts.push(`priority ${existingTask.priority} -> ${updatedPriority}`);
            const assigneeChanged =
                existingTask.assigneeId.length !== updatedAssigneeIds.length ||
                existingTask.assigneeId.some((id) => !updatedAssigneeIds.includes(id));
            if (assigneeChanged) changeParts.push(`assignees updated`);
            await createActivityLog({
                databases,
                workspaceId: task.workspaceId,
                projectId: task.projectId,
                actorMemberId: member.$id,
                actorName: user.name || user.email,
                entityType: ActivityEntityType.TASK,
                entityId: task.$id,
                entityName: task.name,
                action: ActivityAction.UPDATED,
                description: changeParts.length
                    ? `Task updated: ${task.name} (${changeParts.join(", ")})`
                    : `Task updated: no field changes (${task.name})`,
            });
            return c.json({data: task});
        }
    )
    .delete(
        "/:taskId",
        sessionMiddleware,
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const {taskId} = c.req.param();
            const task = await databases.getDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                taskId
            );
            if(!task) {
                return c.json({error: "Missing the task"},404);
            }

            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId: task.workspaceId,
            });
            if(!member) {
                return c.json({error: "Unauthorized"},401);
            }
            await databases.deleteDocument(
                DATABASE_ID,
                TASKS_ID,
                taskId
            );
            await createActivityLog({
                databases,
                workspaceId: task.workspaceId,
                projectId: task.projectId,
                actorMemberId: member.$id,
                actorName: user.name || user.email,
                entityType: ActivityEntityType.TASK,
                entityId: task.$id,
                entityName: task.name,
                action: ActivityAction.DELETED,
                description: `Task deleted: ${task.name}`,
            });
            return c.json({data: {$id: task.$id}});
        }
    )
    .get(
        "/",
        sessionMiddleware,
        zValidator("query",z.object({
            workspaceId: z.string(),
            projectId: z.string().nullish(),
            assigneeId: z.string().nullish(),
            status: z.nativeEnum(TaskStatus).nullish(),
            priority: z.nativeEnum(TaskPriority).nullish(),
            search: z.string().nullish(),
            dueDate: z.string().nullish(),
        })),
        async (c) => {
            const {users} = await createAdminClient();
            const user = c.get("user");
            const databases = c.get("databases");
            const {workspaceId,projectId,assigneeId,status,priority,search,dueDate} = c.req.valid("query");
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId,
            });
            if(!member) {
                return c.json({error: "Unauthorized"},401);
            }
            const query = [
                Query.equal("workspaceId",workspaceId),
                Query.orderDesc("$createdAt"),
            ]
            if(projectId) {
                console.log("projectId",projectId);
                query.push(Query.equal("projectId",projectId));
            }
            if(assigneeId) {
                console.log("assigneeId",assigneeId);
                query.push(Query.contains("assigneeId",assigneeId));
            }
            if(status) {
                console.log("status",status);
                query.push(Query.equal("status",status));
            }
            if(priority) {
                console.log("priority",priority);
                query.push(Query.equal("priority",priority));
            }
            if(dueDate) {
                console.log("dueDate",dueDate);
                query.push(Query.equal("dueDate",dueDate));
            }
            if(search) {
                console.log("search",search);
                query.push(Query.search("name",search));
            }
            const tasks = await databases.listDocuments<Task>(
                DATABASE_ID,
                TASKS_ID,
                query
            );
            const projectIds = tasks.documents.map((task) => task.projectId);

            const assigneeIds = [...new Set(tasks.documents.map((task) => task.assigneeId).flat())];

            const projects = await databases.listDocuments<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
            );

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
            );


            const assignees = await Promise.all(members.documents.map(async (member) => {
                const user = await users.get(member.userId);
                return {
                    ...member,
                    name: user.name,
                    email: user.email,
                }
            }));


            const popupatedTasks = tasks.documents.map((task) => {
                const project = projects.documents.find((project) => project.$id === task.projectId);
                const assignee = assignees.find((assignee) => task.assigneeId.includes(assignee.$id));
                return {
                    ...task,
                    project,
                    assignee,
                }
            });
            return c.json({data:{
                ...tasks,
                documents: popupatedTasks,
            }});
        }
    )
    .post(
        "/",
        sessionMiddleware,
        zValidator("json",createTaskSchema),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const {name,status,workspaceId,projectId,assigneeId,priority,dueDate,description} = c.req.valid("json");
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId,
            });
            if(!member) {
                return c.json({error: "Unauthorized"},401);
            }
            const highestPositionTask = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [
                    Query.equal("projectId",projectId),
                    Query.equal("status",status),
                    Query.orderAsc("position"),
                    Query.limit(1)
                ]
            );
            const newPosition = highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 1000 : 1000;
            const task = await databases.createDocument(
                DATABASE_ID,
                TASKS_ID,
                ID.unique(),
                {
                    name,
                    status,
                    workspaceId,
                    projectId,
                    assigneeId,
                    dueDate,
                    description,
                    position: newPosition,
                    priority: priority.toUpperCase(),
                }
            );
            await createActivityLog({
                databases,
                workspaceId: task.workspaceId,
                projectId: task.projectId,
                actorMemberId: member.$id,
                actorName: user.name || user.email,
                entityType: ActivityEntityType.TASK,
                entityId: task.$id,
                entityName: task.name,
                action: ActivityAction.CREATED,
                description: `Task created: ${task.name} (status: ${task.status}, priority: ${task.priority})`,
            });
            return c.json({data: task});
        }
    )
    .get(
        "/:taskId",
        sessionMiddleware,
        async (c) => {
            const user = c.get("user");
            const {users, databases: adminDatabases} = await createAdminClient();
            const databases = c.get("databases");
            const {taskId} = c.req.param();
            let task: Task;
            try {
                task = await adminDatabases.getDocument<Task>(
                    DATABASE_ID,
                    TASKS_ID,
                    taskId
                );
            } catch {
                return c.json({error: "Task not found"},404);
            }
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId: task.workspaceId,
            });
            if(!member) {
                return c.json({error: "Unauthorized"},401);
            }
            const project = await adminDatabases.getDocument<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                task.projectId
            );

            const assignees = await Promise.all(task.assigneeId.map(async (assigneeId) => {
                const member = await databases.getDocument(
                    DATABASE_ID,
                    MEMBERS_ID,
                    assigneeId
                );
                const user = await users.get(member.userId);
                return {
                    ...user,
                    name: user.name,
                    email: user.email,
                }
            }));
            return c.json({data: {
                ...task,
                project,
                assignees,
            }});
        }
    )
    .post(
        "/bulk-update",
        sessionMiddleware,
        zValidator("json",z.object({
            tasks: z.array(z.object({
                $id: z.string(),
                status: z.nativeEnum(TaskStatus),
                position: z.number().int().positive().min(1000).max(1000000),
            })),
        })),
        async (c) => {

            const databases = c.get("databases");
            const {tasks} = c.req.valid("json");
            const tasksId = tasks.map((task) => task.$id);
            const tasksToUpdate = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [Query.contains("$id", tasksId)]
            );

            const workspaceIds = new Set(tasksToUpdate.documents.map((task) => task.workspaceId));
            if(workspaceIds.size !==1) {
                return c.json({error: "All tasks must be in the same workspace"},400);
            }
            const workspaceId = workspaceIds.values().next().value;
            const user = c.get("user");
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId,
            });
            if(!member) {
                return c.json({error: "Unauthorized"},401);
            }
            const updatedTasks = await Promise.all(tasks.map(async (task) => {
                const {$id,status,position} = task;
                return databases.updateDocument(
                    DATABASE_ID,
                    TASKS_ID,
                    $id,
                    {
                        status,
                        position,
                    }
                );
            }));
            const taskBeforeMap = new Map(tasksToUpdate.documents.map((task) => [task.$id, task]));
            await Promise.all(updatedTasks.map(async (task) => {
                const before = taskBeforeMap.get(task.$id);
                await createActivityLog({
                    databases,
                    workspaceId: task.workspaceId,
                    projectId: task.projectId,
                    actorMemberId: member.$id,
                    actorName: user.name || user.email,
                    entityType: ActivityEntityType.TASK,
                    entityId: task.$id,
                    entityName: task.name,
                    action: ActivityAction.UPDATED,
                    description: before
                        ? `Task moved: ${task.name} (status: ${before.status} -> ${task.status})`
                        : `Task moved: ${task.name} (status: ${task.status})`,
                });
            }));
            return c.json({data: updatedTasks});
        }
    )

export default app;
