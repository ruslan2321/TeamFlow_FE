import { getStoredUser } from "./auth.storage";

export const getCurrentUserId = (): number | undefined => {
  const user = getStoredUser();
  if (!user) return undefined;

  const id = Number(user.id ?? user.userId);
  return Number.isFinite(id) && id > 0 ? id : undefined;
};

export const isValidNumericId = (value: unknown): value is number => {
  const id = Number(value);
  return Number.isFinite(id) && id > 0;
};
