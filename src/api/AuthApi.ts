import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "./BaseApi";

interface LoginResponse {
  token: string;
  success: boolean;
  redirect?: string;
  user?: any;
}

export const AuthApi = createApi({
  reducerPath: "Auth",
  
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { login: string; password: string }>(
      {
        query: (credentials) => ({
          url: "/login",
          method: "POST",
          body: credentials,
        }),
        invalidatesTags: ["Auth"],
      },
    ),
    sendCode: builder.mutation<
      { success: boolean; message?: string; error?: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/sendcode",
        method: "POST",
        body,
      }),
    }),
    sendEmail: builder.mutation<
      { success: boolean; message?: string; error?: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/sendemail",
        method: "POST",
        body,
      }),
    }),
    
  }),
});

export const {
  useLoginMutation,
  useSendCodeMutation,
  useSendEmailMutation,
} = AuthApi;
