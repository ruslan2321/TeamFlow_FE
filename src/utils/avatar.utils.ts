import { BASE_API_URL } from "../api/BaseApi";

const API_ORIGIN = BASE_API_URL.replace(/\/$/, "");

export const extractAvatarFromPayload = (raw: unknown): string => {
  if (!raw || typeof raw !== "object") return "";

  const payload = raw as Record<string, unknown>;
  const user =
    payload.user && typeof payload.user === "object"
      ? (payload.user as Record<string, unknown>)
      : undefined;

  const candidates = [
    user?.avatar,
    payload.avatar,
    user?.avatarUrl,
    payload.avatarUrl,
    payload.file,
    payload.filename,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

export const getAvatarUrl = (
  avatar?: string | null,
  cacheKey?: string | number,
): string | undefined => {
  if (!avatar?.trim()) return undefined;

  const trimmed = avatar.trim();
  let url: string;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    url = trimmed;
  } else if (trimmed.startsWith("/uploads/")) {
    url = `${API_ORIGIN}${trimmed}`;
  } else if (trimmed.startsWith("uploads/")) {
    url = `${API_ORIGIN}/${trimmed}`;
  } else {
    url = `${API_ORIGIN}/uploads/avatars/${trimmed.replace(/^\/+/, "")}`;
  }

  if (cacheKey != null) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}v=${encodeURIComponent(String(cacheKey))}`;
  }

  return url;
};

export type AvatarUserRef = {
  id?: number;
  username?: string;
  avatar?: string | null;
};

export type AvatarLookup = {
  byId: Map<number, string>;
  byUsername: Map<string, string>;
};

export const buildAvatarLookup = (
  users: AvatarUserRef[] | undefined,
): AvatarLookup => {
  const byId = new Map<number, string>();
  const byUsername = new Map<string, string>();

  for (const user of users ?? []) {
    const avatar = user.avatar?.trim();
    if (!avatar) continue;

    if (user.id) byId.set(user.id, avatar);
    if (user.username) byUsername.set(user.username.toLowerCase(), avatar);
  }

  return { byId, byUsername };
};

export const mergeStoredAvatarIntoUsers = (
  users: AvatarUserRef[],
  userId?: number | null,
  stored?: AvatarUserRef | null,
): AvatarUserRef[] => {
  if (!userId || !stored?.avatar?.trim()) return users;

  const withOverride = users.map((user) =>
    user.id === userId ? { ...user, avatar: stored.avatar } : user,
  );

  if (withOverride.some((user) => user.id === userId)) {
    return withOverride;
  }

  return [
    ...withOverride,
    {
      id: userId,
      username: stored.username,
      avatar: stored.avatar,
    },
  ];
};

/** @deprecated use mergeStoredAvatarIntoUsers */
export const enrichUsersWithStoredAvatar = mergeStoredAvatarIntoUsers;

export const resolveUserAvatarUrl = (
  user?: AvatarUserRef | null,
  lookup?: AvatarLookup,
  cacheKey?: string | number,
): string | undefined => {
  const direct = getAvatarUrl(user?.avatar, cacheKey);
  if (direct) return direct;
  if (!user || !lookup) return undefined;

  if (user.id) {
    const byId = lookup.byId.get(user.id);
    if (byId) return getAvatarUrl(byId, cacheKey);
  }

  if (user.username) {
    const byUsername = lookup.byUsername.get(user.username.toLowerCase());
    if (byUsername) return getAvatarUrl(byUsername, cacheKey);
  }

  return undefined;
};
