"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";


export const useCreateTaskModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("create-task") === "true";
  const setIsOpen = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) {
      params.set("create-task", "true");
    } else {
      params.delete("create-task");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close, setIsOpen };
};