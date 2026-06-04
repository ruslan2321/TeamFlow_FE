import type { Task } from "../types/TaskType";

const toStringField = (value: unknown) =>
  value == null ? "" : String(value);

export const normalizeTask = (raw: unknown): Task => {
  const item = (raw ?? {}) as Record<string, unknown>;
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

export const getTaskListKey = (task: Task, index: number) =>
  task.task_id > 0
    ? String(task.task_id)
    : `task-${index}-${task.userId}-${task.title}-${task.createAt}`;
