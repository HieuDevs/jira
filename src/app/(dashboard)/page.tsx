import { getCurrentUser } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const workspaces = await getWorkspaces();
  if (!workspaces || workspaces.total === 0) {
    return redirect("/workspaces/create");
  } else {
    return redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
