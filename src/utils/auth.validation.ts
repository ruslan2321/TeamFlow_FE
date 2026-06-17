export type LoginFormData = {
  login: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  email: string;
  login: string;
  password: string;
};

export type LoginField = keyof LoginFormData;
export type RegisterField = keyof RegisterFormData;

export type FormErrors<T extends string> = Partial<Record<T | "form", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = (
  data: LoginFormData,
): FormErrors<LoginField> => {
  const errors: FormErrors<LoginField> = {};
  const login = data.login.trim();

  if (!login) {
    errors.login = "Введите логин";
  } else if (login.length < 3) {
    errors.login = "Логин должен содержать минимум 3 символа";
  }

  if (!data.password) {
    errors.password = "Введите пароль";
  } else if (data.password.length < 6) {
    errors.password = "Пароль должен содержать минимум 6 символов";
  }

  return errors;
};

export const validateRegister = (
  data: RegisterFormData,
): FormErrors<RegisterField> => {
  const errors: FormErrors<RegisterField> = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const login = data.login.trim();

  if (!name) {
    errors.name = "Введите имя или ФИО";
  } else if (name.length < 2) {
    errors.name = "Имя должно содержать минимум 2 символа";
  }

  if (!email) {
    errors.email = "Введите email";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Введите корректный email";
  }

  if (!login) {
    errors.login = "Введите логин";
  } else if (login.length < 3) {
    errors.login = "Логин должен содержать минимум 3 символа";
  } else if (!/^[a-zA-Z0-9._-]+$/.test(login)) {
    errors.login = "Логин может содержать только буквы, цифры, . _ -";
  }

  if (!data.password) {
    errors.password = "Введите пароль";
  } else if (data.password.length < 6) {
    errors.password = "Пароль должен содержать минимум 6 символов";
  }

  return errors;
};

const extractApiMessages = (error: unknown): string[] => {
  if (!error || typeof error !== "object") {
    return ["Произошла ошибка. Попробуйте снова."];
  }

  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== "object") {
    const status = (error as { status?: number }).status;
    if (status === 401) return ["Неверный логин или пароль"];
    return ["Произошла ошибка. Попробуйте снова."];
  }

  const payload = data as { message?: string | string[]; error?: string };
  if (Array.isArray(payload.message)) {
    return payload.message.filter((item) => typeof item === "string");
  }
  if (typeof payload.message === "string" && payload.message.trim()) {
    return [payload.message];
  }
  if (typeof payload.error === "string" && payload.error.trim()) {
    return [payload.error];
  }

  return ["Произошла ошибка. Попробуйте снова."];
};

const REGISTER_FIELD_RULES: Array<{
  field: RegisterField;
  patterns: RegExp[];
}> = [
  { field: "name", patterns: [/имя/i, /name/i, /фио/i, /username/i] },
  { field: "email", patterns: [/email/i, /почт/i, /e-mail/i] },
  { field: "login", patterns: [/логин/i, /login/i] },
  { field: "password", patterns: [/парол/i, /password/i] },
];

export const mapRegisterApiErrors = (
  error: unknown,
): FormErrors<RegisterField> => {
  const messages = extractApiMessages(error);
  const errors: FormErrors<RegisterField> = {};
  const unmapped: string[] = [];

  for (const message of messages) {
    const rule = REGISTER_FIELD_RULES.find(({ patterns }) =>
      patterns.some((pattern) => pattern.test(message)),
    );

    if (rule) {
      errors[rule.field] = errors[rule.field]
        ? `${errors[rule.field]}; ${message}`
        : message;
    } else {
      unmapped.push(message);
    }
  }

  if (unmapped.length) {
    errors.form = unmapped.join(". ");
  }

  return errors;
};

export const mapLoginApiErrors = (error: unknown): FormErrors<LoginField> => {
  const messages = extractApiMessages(error);
  const text = messages.join(". ");
  const errors: FormErrors<LoginField> = { form: text };

  const loginRule = messages.find((msg) => /логин|login/i.test(msg));
  const passwordRule = messages.find((msg) => /парол|password/i.test(msg));

  if (loginRule) errors.login = loginRule;
  if (passwordRule) errors.password = passwordRule;

  return errors;
};

export const hasFormErrors = <T extends string>(
  errors: FormErrors<T>,
): boolean => Object.keys(errors).length > 0;
