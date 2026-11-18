import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { AuthorAvatarProps } from "./types";

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

export function AuthorAvatar({ author, size = "default" }: AuthorAvatarProps) {
  return (
    <Avatar size={size}>
      {author.image ? (
        <Image
          src={author.image}
          alt=""
          sizes="40px"
          className="size-full rounded-full object-cover"
        />
      ) : (
        <AvatarFallback className="bg-primary/10 font-medium text-primary-text">
          {getInitials(author.name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
