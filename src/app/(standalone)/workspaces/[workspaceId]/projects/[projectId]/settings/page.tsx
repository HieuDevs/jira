import { getCurrentUser } from "@/features/auth/queries";

import { redirect } from "next/navigation";
import { ProjectIdSettingsClient } from "./client";

const ProjectSettingsPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  return <ProjectIdSettingsClient />;
};

export default ProjectSettingsPage;
