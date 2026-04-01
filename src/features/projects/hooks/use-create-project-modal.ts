"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";


export const useCreateProjectModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("create-project") === "true";
  const setIsOpen = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) {
      params.set("create-project", "true");
    } else {
      params.delete("create-project");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close, setIsOpen };
};