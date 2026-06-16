import { Avatar, type AvatarProps } from "@chakra-ui/react";
import { getAvatarUrl, resolveUserAvatarUrl, type AvatarLookup } from "../../utils/avatar.utils";

type UserAvatarProps = Omit<AvatarProps, "src"> & {
  avatar?: string | null;
  user?: { id?: number; username?: string; avatar?: string | null };
  lookup?: AvatarLookup;
  cacheKey?: string | number;
};

export default function UserAvatar({
  avatar,
  user,
  lookup,
  cacheKey,
  name,
  ...props
}: UserAvatarProps) {
  const ref = user ?? (avatar != null ? { avatar } : undefined);
  const src =
    resolveUserAvatarUrl(ref, lookup, cacheKey) ??
    getAvatarUrl(avatar ?? user?.avatar, cacheKey);

  return <Avatar name={name ?? user?.username} src={src} {...props} />;
}
