import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { Workspace } from "./types";
export const getWorkspaces = async () => {
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
};

interface GetWorkspaceInfoProps {
  workspaceId: string;

}
export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps) => {
  const { databases } = await createSessionClient();
  const workspace = await databases.getDocument<Workspace>(
    DATABASE_ID,
    WORKSPACES_ID,
    workspaceId
  );
  return {
    name: workspace.name,
  };
};
