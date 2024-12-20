import { Button } from "@/components/ui/button";
import { format } from "date-fns/format";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
interface CustomToolbarCalendarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

export const CustomToolbarCalendar: React.FC<CustomToolbarCalendarProps> = ({
  date,
  onNavigate,
}) => {
  return (
    <div className="flex items-center justify-between mb-4 gap-x-2 w-full lg:w-auto lg:justify-start">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onNavigate("PREV")}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <span className="text-xs font-medium">{format(date, "MMMM yyyy")}</span>
      </div>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onNavigate("NEXT")}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};
