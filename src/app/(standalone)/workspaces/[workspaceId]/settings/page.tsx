import { getCurrentUser } from "@/features/auth/queries";
import { WorkspaceIdSettingsClient } from "./client";
import { redirect } from "next/navigation";

const WorkspaceIdSettingsPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  return <WorkspaceIdSettingsClient />;
};

export default WorkspaceIdSettingsPage;
