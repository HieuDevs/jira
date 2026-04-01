"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";


export const useUpdateTaskModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const taskId = searchParams.get("edit-task");
  const setTaskId = (nextTaskId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextTaskId) {
      params.set("edit-task", nextTaskId);
    } else {
      params.delete("edit-task");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const open = (nextTaskId: string) => setTaskId(nextTaskId);
  const close = () => setTaskId(null);
  return { taskId, open, close, setTaskId };
};