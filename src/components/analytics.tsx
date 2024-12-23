import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

interface AnalyticsProps {
  data: {
    taskCount: number;
    taskDiff: number;
    projectCount?: number;
    projectDiff?: number;
    incompleteTaskCount?: number;
    incompleteTaskDiff?: number;
    assignedTaskCount: number;
    assignedTaskDiff: number;
    completedTaskCount: number;
    completedTaskDiff: number;
    overdueTaskCount: number;
    overdueTaskDiff: number;
  };
}

export const Analytics = ({ data }: AnalyticsProps) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="flex flex-row w-full">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDiff > 0 ? "up" : "down"}
            increaseValue={data.taskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.incompleteTaskCount ?? 0}
            variant={data.incompleteTaskDiff ?? 0 > 0 ? "up" : "down"}
            increaseValue={data.incompleteTaskDiff ?? 0}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
