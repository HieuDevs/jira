import { getCurrentUser } from "@/features/auth/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceSettingsPage = async ({
  params,
}: WorkspaceSettingsPageProps) => {
  const { workspaceId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const workspace = await getWorkspace({ workspaceId });
  if (!workspace) {
    return redirect("/");
  }
  return (
    <div className="w-full md:max-w-4xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceSettingsPage;
