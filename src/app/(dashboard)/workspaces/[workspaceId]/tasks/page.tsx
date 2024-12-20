import { getCurrentUser } from "@/features/auth/queries";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col h-full">
      <TaskViewSwitcher />
    </div>
  );
}
