"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { MemberRole } from "@/features/members/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import {
  ArrowLeftIcon,
  MoreVerticalIcon,
  ShieldCheckIcon,
  ShieldXIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { confirm, ConfirmationDialog } = useConfirm(
    "Remove Member",
    "Are you sure you want to remove this member?",
    "destructive"
  );
  const { data: members } = useGetMembers({ workspaceId });
  const { mutate: updateMemberRole, isPending: isUpdatingMemberRole } =
    useUpdateMember();
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();

  const handleUpdateMemberRole = (memberId: string, role: MemberRole) => {
    updateMemberRole({ param: { memberId }, json: { role } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const confirmed = await confirm();
    if (!confirmed) return;
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmationDialog />
      <CardHeader className="flex flex-row items-center gap-4 p-7 space-y-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {members?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-4">
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="size-10"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem
                    disabled={isUpdatingMemberRole}
                    onClick={() =>
                      handleUpdateMemberRole(member.$id, MemberRole.ADMIN)
                    }
                    className="cursor-pointer"
                  >
                    <ShieldCheckIcon className="size-4" />
                    Set as Adminstrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isUpdatingMemberRole}
                    onClick={() =>
                      handleUpdateMemberRole(member.$id, MemberRole.MEMBER)
                    }
                    className="cursor-pointer"
                  >
                    <ShieldXIcon className="size-4" />
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isDeletingMember}
                    onClick={() => handleDeleteMember(member.$id)}
                    className="cursor-pointer text-destructive"
                  >
                    <TrashIcon className="size-4" />
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {index < members.documents.length - 1 && (
              <div className="my-2.5">
                <Separator />
              </div>
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
