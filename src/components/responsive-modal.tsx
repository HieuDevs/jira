import { useMedia } from "react-use";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
interface ResponsiveModalProps {
  children: React.ReactNode;
  isOpen: boolean | null;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({
  children,
  isOpen,
  onOpenChange,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  if (isDesktop) {
    return (
      <Dialog open={isOpen ?? false} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[90vh]">
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={isOpen ?? false} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="w-full p-0 border-none overflow-y-auto hide-scrollbar max-h-[90vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
