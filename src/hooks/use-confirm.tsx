import { JSX, useState } from "react";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const useConfirm = (
  title: string,
  description: string,
  variant: ButtonProps["variant"] = "destructive"
): {
  confirm: () => Promise<boolean | null>;
  ConfirmationDialog: () => JSX.Element;
} => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <ResponsiveModal isOpen={!!promise} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            </CardHeader>
            <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
              <Button
                variant="outline"
                className="w-full lg:w-auto"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                variant={variant}
                className="w-full lg:w-auto"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    );
  };

  return { confirm, ConfirmationDialog };
};
