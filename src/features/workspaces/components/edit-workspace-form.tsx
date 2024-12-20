"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";
interface EditWorkspaceFormProps {
  initialValues: Workspace;
  onCancel?: () => void;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate: updateWorkspace, isPending: updateWorkspacePending } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: deleteWorkspacePending } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: resetInviteCodePending } =
    useResetInviteCode();
  const { confirm, ConfirmationDialog } = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace? This action is irreversible and will delete all data associated with it."
  );

  const {
    confirm: confirmResetInviteCode,
    ConfirmationDialog: ConfirmationDialogResetInviteCode,
  } = useConfirm(
    "Reset Invite Code",
    "Are you sure you want to reset the invite code? This will invalidate the current invite link."
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    updateWorkspace({
      form: finalValues,
      param: { workspaceId: initialValues.$id },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleDeleteWorkspace = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    deleteWorkspace({ param: { workspaceId: initialValues.$id } });
  };

  const handleResetInviteCode = async () => {
    const confirmed = await confirmResetInviteCode();
    if (!confirmed) return;
    resetInviteCode({ param: { workspaceId: initialValues.$id } });
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => {
        toast.success("Invite link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy invite link");
      });
  };

  const fullInviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`
      : "";

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmationDialog />
      <ConfirmationDialogResetInviteCode />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
            variant="outline"
            size="icon"
          >
            <ArrowLeftIcon className="size-4" />{" "}
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Workspace Image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-500" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">Workspace Icon</p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, SVG or JPEG max 1mb
                          </p>
                          <input
                            type="file"
                            accept=".jpg,.png,.svg,.jpeg"
                            ref={inputRef}
                            className="hidden"
                            disabled={
                              updateWorkspacePending || deleteWorkspacePending
                            }
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              variant="destructive"
                              size="xs"
                              className="w-fit"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                              disabled={
                                updateWorkspacePending || deleteWorkspacePending
                              }
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="tertiary"
                              size="xs"
                              className="w-fit"
                              onClick={() => inputRef.current?.click()}
                              disabled={
                                updateWorkspacePending || deleteWorkspacePending
                              }
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={onCancel}
                  disabled={updateWorkspacePending || deleteWorkspacePending}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={updateWorkspacePending || deleteWorkspacePending}
                >
                  Update Workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold"> Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link below to invite members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input value={fullInviteLink} disabled className="w-full" />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="secondary"
                  className="w-fit size-12"
                >
                  <CopyIcon className="size-4" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="pt-6" />
            <Button
              variant="destructive"
              size="lg"
              disabled={resetInviteCodePending}
              className="mt-6 w-fit ml-auto font-semibold text-md"
              onClick={handleResetInviteCode}
            >
              Reset Invite Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold"> Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Delete a workspace and all of its data will be lost and
              irreversible.
            </p>
            <DottedSeparator className="pt-6" />
            <Button
              variant="destructive"
              size="lg"
              disabled={deleteWorkspacePending}
              className="mt-6 w-fit ml-auto font-semibold text-md"
              onClick={handleDeleteWorkspace}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
