import { getCurrentUser } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

type WorkspaceIdJoinPageParams = Promise<{
  workspaceId: string;
  invitecode: string;
}>;

type WorkspaceIdJoinPageProps = {
  params: WorkspaceIdJoinPageParams;
};

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrentUser();
  const { workspaceId, invitecode } = await params;
  const workspace = await getWorkspaceInfo({
    workspaceId: workspaceId,
  });
  if (!user) {
    return redirect("/sign-in");
  }
  if (!workspace) {
    return redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        initialValues={{
          name: workspace.name || "",
          workspaceId,
          invitecode,
        }}
      />
    </div>
  );
};

export default WorkspaceIdJoinPage;
