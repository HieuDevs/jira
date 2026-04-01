import { getCurrentUser } from "@/features/auth/queries";
import { ActivityLogView } from "@/features/activity-logs/components/activity-log-view";
import { redirect } from "next/navigation";

export default async function ActivityLogsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <ActivityLogView />;
}
