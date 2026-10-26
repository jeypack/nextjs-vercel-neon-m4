import Image from "next/image";
import type {UserItem} from "@/app/user/_lib/types";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarProps = {
  user: UserItem;
  size?: Size;
};

export default function Avatar({user, size = "md"}: AvatarProps) {
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-14 w-14 text-xl",
    lg: "h-20 w-20 text-2xl",
    xl: "h-32 w-32 text-4xl",
  };
  return (
    <div className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200`}>
      {user.image ? (
        <Image
          src={user.image}
          alt={`Profilbild von ${[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}`}
          width={56}
          height={56}
          loading="eager"
          className="h-full w-full object-cover"
        />
      ) : (
        (user.firstName?.[0] ?? user.email[0]).toUpperCase()
      )}
    </div>
  );
}
