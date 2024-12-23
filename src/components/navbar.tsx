"use client";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { UserButton } from "@/features/auth/components/user-button";
import { usePathname } from "next/navigation";
const pathNameMap = {
  "tasks": {
    title: "Tasks",
    description: "View all of your tasks here",
  },
  "projects": {
    title: "Projects",
    description: "Manage your projects here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};
export const Navbar = () => {
  const pathName = usePathname();
  const pathNameParts = pathName.split("/");
  const pathNameKey = pathNameParts[3] as keyof typeof pathNameMap;
  const { title, description } = pathNameMap[pathNameKey] || defaultMap;
  return (
    <nav className="pt-4 px-6 flex justify-between items-center">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
