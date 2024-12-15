import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  className,
}: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn("size-10 relative rounded-md overflow-hidden", className)}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          unoptimized // Bypass Next.js image optimization for external URLs
        />
      </div>
    );
  }
  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="uppercase font-semibold text-lg bg-blue-600 text-white rounded-md">
        {name ? name.charAt(0) : "W"}
      </AvatarFallback>
    </Avatar>
  );
};
