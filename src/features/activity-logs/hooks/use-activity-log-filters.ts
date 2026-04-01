"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ActivityLogFilters = {
  projectId: string | null;
  startDate: string | null;
  endDate: string | null;
};

export const useActivityLogFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: ActivityLogFilters = {
    projectId: searchParams.get("projectId"),
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  };

  const setFilters = (nextFilters: Partial<ActivityLogFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return [filters, setFilters] as const;
};
