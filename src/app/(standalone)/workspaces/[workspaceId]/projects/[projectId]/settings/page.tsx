import { getCurrentUser } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

interface ProjectSettingsPageProps {
  params: {
    projectId: string;
  };
}

const ProjectSettingsPage = async ({ params }: ProjectSettingsPageProps) => {
  const { projectId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const initialValues = await getProject({ projectId });
  if (!initialValues) {
    return redirect("/");
  }
  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectSettingsPage;
