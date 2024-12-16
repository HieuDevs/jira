import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../members/utils";
import { Project } from "./types";

interface GetProjectInfoProps {
  projectId: string;
}
export const getProject = async ({ projectId }: GetProjectInfoProps) => {

    const { account, databases } = await createSessionClient();
    const user = await account.get();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );
    if (!project) {
      throw new Error("Project not found");
    }
  const member = await getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id,
  });
  if (!member) {
    throw new Error("Unauthorized");
  }
  return project;
}