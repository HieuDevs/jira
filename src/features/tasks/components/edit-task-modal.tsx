"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { EditTaskFormWrapper } from "./edit-task-form-wrapper";

export const EditTaskModal = () => {
  const { taskId, close } = useUpdateTaskModal();
  return (
    <ResponsiveModal isOpen={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};
