import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";


const WorkspaceIdPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  return <WorkspaceIdClient />;
};

export default WorkspaceIdPage;
