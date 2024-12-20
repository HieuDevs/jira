import { Loader } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="animate-spin size-6 text-muted-foreground" />
    </div>
  );
};
