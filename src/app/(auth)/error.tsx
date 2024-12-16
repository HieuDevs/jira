"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = ({ error }: { error: Error & { digest?: string } }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-2">
      <AlertTriangle className="size-6" />
      <p className="text-sm text-muted-foreground">
        {error.message || "Something went wrong. Please try again later."}
      </p>
      <Button asChild variant="secondary">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
