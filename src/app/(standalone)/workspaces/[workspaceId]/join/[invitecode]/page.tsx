import { getCurrentUser } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;

    invitecode: string;
  };
}

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
          name: workspace?.name || "",
          workspaceId: workspaceId,
          invitecode: invitecode,
        }}
      />
    </div>
  );
};

export default WorkspaceIdJoinPage;
