import { Loader } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader className="animate-spin size-6 text-muted-foreground" />
    </div>
  );
};