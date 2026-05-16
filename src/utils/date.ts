import { format, isValid, parseISO, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export const formatDate = (
  date: string | Date | null | undefined,
  pattern = "dd.MM.yyyy HH:mm",
): string => {
  if (!date) return "—";

  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) ? format(d, pattern, { locale: ru }) : "Неверная дата";
};

export const formatForInput = (
  date: string | Date | null | undefined,
): string => {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const formatRelative = (
  date: string | Date | null | undefined,
): string => {
  if (!date) return "—";

  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d)
    ? formatDistanceToNow(d, { addSuffix: true, locale: ru })
    : "—";
};
