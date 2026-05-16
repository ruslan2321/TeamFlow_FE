import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "./BaseApi";
import type { Task } from "../types/TaskType";

export const TaskApi = createApi({
  reducerPath: "Task",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "task/task",
      providesTags: ["Task"],
    }),
    getUserTask: builder.query<Task[], number>({
      query: (id) => `task/user/${id}`,
      providesTags: ["Task"],
    }),
    addTask: builder.mutation<Task, { dto: Partial<Task>; userId: number }>({
      query: ({ dto, userId }) => ({
        url: `task/add_task/${userId}`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Task"],
    }),
    viewTask: builder.query<Task, number | string>({
      query: (task_id) => `task/${task_id}`,
      providesTags: ["Task"],
    }),
    editTask: builder.mutation<Task, { task_id: number; dto: Partial<Task> }>({
      query: ({ task_id, dto }) => ({
        url: `task/edittask/${task_id}`,
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: ["Task"],
    }),
    getMyTask: builder.query<Task[], number>({
      query: (userId) => `task/my/${userId}`,
      providesTags: ["Task"],
    }),
    deleteTask: builder.mutation<void, number>({
      query: (task_id) => ({
        url: `task/delet/${task_id}`, 
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
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
  useDeleteTaskMutation
} = TaskApi;
