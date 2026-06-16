const AUTH_TOKEN_KEY = "authToken";
const USER_KEY = "user";
const EXPIRES_IN_SECONDS_KEY = "expiresInSeconds";
const REMEMBER_ME_PREF_KEY = "rememberMePreference";
const SAVED_LOGIN_KEY = "savedLogin";

export type AuthSessionUser = Record<string, unknown> & {
  id?: number;
  userId?: number;
  username?: string;
  email?: string;
  avatar?: string;
};

export type LoginSessionData = {
  token: string;
  expiresInSeconds?: number;
  user: AuthSessionUser;
};

const getActiveStorage = (): Storage | null => {
  if (sessionStorage.getItem(AUTH_TOKEN_KEY)) return sessionStorage;
  if (localStorage.getItem(AUTH_TOKEN_KEY)) return localStorage;
  return null;
};

export const getAuthToken = (): string | null => {
  return (
    sessionStorage.getItem(AUTH_TOKEN_KEY) ??
    localStorage.getItem(AUTH_TOKEN_KEY)
  );
};

export const getStoredUser = (): AuthSessionUser | null => {
  try {
    const raw =
      sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSessionUser;
  } catch {
    return null;
  }
};

export const isRememberMeSession = (): boolean =>
  Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

export const getRememberMePreference = (): boolean =>
  localStorage.getItem(REMEMBER_ME_PREF_KEY) === "true";

export const getSavedLogin = (): string =>
  localStorage.getItem(SAVED_LOGIN_KEY) ?? "";

export const saveAuthSession = (
  data: LoginSessionData,
  rememberMe: boolean,
  login: string,
) => {
  clearAuthSession();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(AUTH_TOKEN_KEY, data.token);
  storage.setItem(USER_KEY, JSON.stringify(data.user));

  if (data.expiresInSeconds != null) {
    storage.setItem(
      EXPIRES_IN_SECONDS_KEY,
      String(data.expiresInSeconds),
    );
  }

  localStorage.setItem(REMEMBER_ME_PREF_KEY, String(rememberMe));

  if (rememberMe && login.trim()) {
    localStorage.setItem(SAVED_LOGIN_KEY, login.trim());
  } else {
    localStorage.removeItem(SAVED_LOGIN_KEY);
  }
};

export const updateStoredUser = (patch: Partial<AuthSessionUser>) => {
  const storage = getActiveStorage();
  if (!storage) return;

  const current = getStoredUser();
  if (!current) return;

  storage.setItem(USER_KEY, JSON.stringify({ ...current, ...patch }));
};

export const clearAuthSession = () => {
  for (const storage of [sessionStorage, localStorage]) {
    storage.removeItem(AUTH_TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(EXPIRES_IN_SECONDS_KEY);
  }
};
