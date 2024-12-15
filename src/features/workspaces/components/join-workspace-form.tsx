"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useJoinWorkspace } from "../api/use-join-workspace";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
    workspaceId: string;
    invitecode: string;
  };
}

export const JoinWorkspaceForm = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();
  const handleJoinWorkspace = () => {
    joinWorkspace(
      {
        json: {
          code: initialValues.invitecode,
        },
        param: {
          workspaceId: initialValues.workspaceId,
        },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.workspaceId}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You &apos;ve been invited to join{" "}
          <strong>{initialValues.name}</strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <Button
            variant="secondary"
            className="w-full lg:w-auto"
            type="button"
            size="lg"
            disabled={isPending}
            asChild
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            type="button"
            className="w-full lg:w-auto"
            size="lg"
            onClick={handleJoinWorkspace}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
