import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdPageProps {
  params: { workspaceId: string };
}

const WorkspaceIdPage = async ({ params }: WorkspaceIdPageProps) => {
  const user = await getCurrentUser();
  const { workspaceId } = await params;
  if (!user) {
    return redirect("/sign-in");
  }

  return <div> WorkspaceIdPage {workspaceId}</div>;
};

export default WorkspaceIdPage;
