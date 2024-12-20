import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { differenceInDays } from "date-fns/differenceInDays";

interface TaskDateProps {
  value: string;
  className?: string;
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let bgColor = "bg-gray-100";
  let textColor = "text-gray-600";
  let borderColor = "border-gray-200";

  if (diffInDays <= 3) {
    bgColor = "bg-red-50";
    textColor = "text-red-700";
    borderColor = "border-red-100";
  } else if (diffInDays <= 7) {
    bgColor = "bg-orange-50";
    textColor = "text-orange-700";
    borderColor = "border-orange-100";
  } else if (diffInDays <= 14) {
    bgColor = "bg-yellow-50";
    textColor = "text-yellow-700";
    borderColor = "border-yellow-100";
  } else if (diffInDays <= 30) {
    bgColor = "bg-green-50";
    textColor = "text-green-700";
    borderColor = "border-green-100";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md border",
        bgColor,
        textColor,
        borderColor,
        className
      )}
    >
      <span className="text-sm font-medium">{format(value, "PP")}</span>
    </div>
  );
};
