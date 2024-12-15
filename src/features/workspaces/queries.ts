import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { Workspace } from "./types";
export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();
    if (!user) {
      return null;
    }
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("userId", user.$id)]
    );
    if (members.total === 0) {
      return null;
    }
    const workspaceId = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspaceId),
      ]
    );
    return workspaces;
  } catch  {
    return null;
  }
}

interface GetWorkspaceProps {
  workspaceId: string;
}
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();
    if (!user) {
      return null;
    }
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) {
      return null;
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return workspace;
  } catch  {
    return null;
  }
}

interface GetWorkspaceInfoProps {
  workspaceId: string;

}
export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps) => {
  try {
    const {  databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return {
      name: workspace.name,
    };
  } catch  {
    return null;
  }
}