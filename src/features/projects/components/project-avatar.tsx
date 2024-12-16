import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn("size-5 relative rounded-md overflow-hidden", className)}
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
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "uppercase font-semibold text-sm bg-blue-600 text-white rounded-md",
          fallbackClassName
        )}
      >
        {name ? name.charAt(0) : "W"}
      </AvatarFallback>
    </Avatar>
  );
};
