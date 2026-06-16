import type { Task } from "../types/TaskType";

const toStringField = (value: unknown) =>
  value == null ? "" : String(value);

const unwrapTaskPayload = (raw: unknown): Record<string, unknown> => {
  const item = (raw ?? {}) as Record<string, unknown>;
  const nested = item.data;

  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }

  return item;
};

export const normalizeTask = (raw: unknown): Task => {
  const item = unwrapTaskPayload(raw);
  const id = Number(item.task_id ?? item.id ?? item.taskId);
  const assigned = item.assignedUser as Task["assignedUser"] | undefined;

  return {
    task_id: Number.isFinite(id) && id > 0 ? id : 0,
    title: toStringField(item.title),
    description: toStringField(item.description),
    status: toStringField(item.status) || "К разработке",
    name_task: toStringField(item.name_task),
    CommentTask: toStringField(item.CommentTask),
    userId: Number(item.userId) || 0,
    createAt: toStringField(item.createAt),
    assignedUser: assigned
      ? {
          id: Number(assigned.id) || 0,
          username: toStringField(assigned.username),
          email: assigned.email ? toStringField(assigned.email) : undefined,
          avatar: assigned.avatar ? toStringField(assigned.avatar) : undefined,
        }
      : undefined,
  };
};

export const normalizeTasks = (response: unknown): Task[] => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray((response as { data?: unknown })?.data)
      ? (response as { data: unknown[] }).data
      : [];

  return list.map((item) => normalizeTask(item));
};

export const getTaskStableKey = (task: Task): string =>
  task.task_id > 0
    ? String(task.task_id)
    : `task-${task.userId}-${task.title}-${task.description}-${task.name_task}`;

export const getTaskListKey = (task: Task, index: number) =>
  task.task_id > 0 ? String(task.task_id) : `${getTaskStableKey(task)}-${index}`;

export const getTaskRouteKey = (task: Task) => getTaskStableKey(task);

const parseLegacyRouteKey = (key: string) => {
  const match = key.match(/^task-(\d+)-(\d+)-(.+)-$/);
  if (!match) return undefined;

  return {
    userId: Number(match[2]),
    title: match[3],
  };
};

export const findTaskInList = (
  tasks: Task[],
  routeKey: string | undefined,
): Task | undefined => {
  if (!routeKey) return undefined;

  const key = decodeURIComponent(routeKey);

  if (/^\d+$/.test(key)) {
    const byId = tasks.find((task) => task.task_id === Number(key));
    if (byId) return byId;
  }

  const byStableKey = tasks.find((task) => getTaskStableKey(task) === key);
  if (byStableKey) return byStableKey;

  const legacy = parseLegacyRouteKey(key);
  if (legacy && Number.isFinite(legacy.userId)) {
    return tasks.find(
      (task) =>
        task.userId === legacy.userId &&
        task.title === legacy.title &&
        task.task_id <= 0,
    );
  }

  return undefined;
};

export const isPopulatedTask = (task: Task | undefined): task is Task =>
  !!task && Boolean(task.title || task.description || task.name_task);
