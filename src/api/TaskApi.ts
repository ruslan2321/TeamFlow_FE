import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "./BaseApi";
import type { Task } from "../types/TaskType";
import { normalizeTask, normalizeTasks } from "./taskNormalize";

const taskListTag = { type: "Task" as const, id: "LIST" };

export const TaskApi = createApi({
  reducerPath: "Task",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "task/task",
      transformResponse: (response: unknown) => normalizeTasks(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((task) => ({
                type: "Task" as const,
                id: task.task_id || "LIST",
              })),
              taskListTag,
            ]
          : [taskListTag],
    }),
    getUserTask: builder.query<Task[], number>({
      query: (id) => `task/user/${id}`,
      transformResponse: (response: unknown) => normalizeTasks(response),
      providesTags: [taskListTag],
    }),
    addTask: builder.mutation<Task, { dto: Partial<Task>; userId: number }>({
      query: ({ dto, userId }) => ({
        url: `task/add_task/${userId}`,
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: unknown) => normalizeTask(response),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newTask } = await queryFulfilled;
          dispatch(
            TaskApi.util.updateQueryData("getTasks", undefined, (draft) => {
              const alreadyListed = draft.some(
                (task) =>
                  (task.task_id > 0 &&
                    newTask.task_id > 0 &&
                    task.task_id === newTask.task_id) ||
                  (task.title === newTask.title &&
                    task.name_task === newTask.name_task &&
                    task.userId === newTask.userId),
              );
              if (!alreadyListed) {
                draft.unshift(newTask);
              }
            }),
          );
        } catch {
          /* ошибка создания — кэш не трогаем */
        }
      },
      invalidatesTags: [taskListTag],
    }),
    viewTask: builder.query<Task, number | string>({
      query: (task_id) => `task/${task_id}`,
      transformResponse: (response: unknown) => normalizeTask(response),
      providesTags: (_result, _error, task_id) => [
        { type: "Task", id: task_id },
      ],
    }),
    editTask: builder.mutation<Task, { task_id: number; dto: Partial<Task> }>({
      query: ({ task_id, dto }) => ({
        url: `task/edittask/${task_id}`,
        method: "PATCH",
        body: dto,
      }),
      transformResponse: (response: unknown) => normalizeTask(response),
      invalidatesTags: [taskListTag],
    }),
    getMyTask: builder.query<Task[], number>({
      query: (userId) => `task/my/${userId}`,
      transformResponse: (response: unknown) => normalizeTasks(response),
      providesTags: [taskListTag],
    }),
    deleteTask: builder.mutation<void, number>({
      query: (task_id) => ({
        url: `task/delet/${task_id}`,
        method: "DELETE",
      }),
      invalidatesTags: [taskListTag],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetUserTaskQuery,
  useAddTaskMutation,
  useViewTaskQuery,
  useEditTaskMutation,
  useGetMyTaskQuery,
  useDeleteTaskMutation,
} = TaskApi;
