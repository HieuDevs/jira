import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { TaskIdClient } from "./client";
const TaskIdPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <TaskIdClient />;
};

export default TaskIdPage;
