import { getCurrentUser } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

const CreateWorkspacePage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default CreateWorkspacePage;
