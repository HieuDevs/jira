import { getCurrentUser } from "@/features/auth/queries";
import { MembersList } from "@/features/workspaces/components/members-list";
import { redirect } from "next/navigation";

const WorkspaceMembersPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceMembersPage;
