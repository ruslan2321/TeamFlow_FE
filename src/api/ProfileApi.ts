import type { Profile } from "../types/ProfileType";
import type {
  SearchUsersParams,
  SearchUsersResponse,
} from "../types/SearchType";
import { BASE_API_URL } from "./BaseApi";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type UpdateProfilePayload = Partial<Omit<Profile, "id" | "login" | "password">>;

type UpdateProfileResponse = {
  message: string;
  user: Profile;
};

type UploadAvatarResponse = {
  message: string;
  user: Profile;
};

export const ProfileApi = createApi({
  reducerPath: "Profile",
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
  tagTypes: ["Profile", "Users"],
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, number>({
      query: (id) => `profile/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Profile", id }],
      transformResponse: (response: any): Profile => ({
        ...response,
        aboutMe: response.aboutMe ?? response.aboutme ?? "",
        avatar: response.avatar ?? "",
      }),
    }),

    updateProfile: builder.mutation<Profile, UpdateProfilePayload>({
      query: (userData) => ({
        url: "update_profile",
        method: "PATCH",
        body: userData,
      }),
      transformResponse: (response: UpdateProfileResponse): Profile => ({
        ...response.user,
        aboutMe:
          response.user?.aboutMe ?? (response.user as any)?.aboutme ?? "",
        avatar: response.user?.avatar ?? "",
      }),
      invalidatesTags: (_result, _error, _arg) => {
        const userId = Number(localStorage.getItem("userId"));
        return [{ type: "Profile", id: userId }];
      },
    }),

    updateAvatar: builder.mutation<Profile, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return {
          url: "update_avatar",
          method: "PATCH",
          body: formData,
        };
      },
      transformResponse: (response: UploadAvatarResponse): Profile => ({
        ...response.user,
        aboutMe:
          response.user?.aboutMe ?? (response.user as any)?.aboutme ?? "",
        avatar: response.user?.avatar ?? "",
      }),
      invalidatesTags: (_result, _error, _arg) => {
        const userId = Number(localStorage.getItem("userId"));
        return [{ type: "Profile", id: userId }];
      },
    }),

    veryfcode: builder.mutation<
      { success: boolean; message?: string; error?: string },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "verifycode",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    addUser: builder.mutation<Profile | void, Omit<Profile, "id">>({
      query: (addUser) => ({
        url: "add_user",
        method: "POST",
        body: addUser,
      }),
      invalidatesTags: ["Users"],
    }),

    searchUsers: builder.query<SearchUsersResponse, SearchUsersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.q) searchParams.append("q", params.q);
        if (params.page) searchParams.append("page", String(params.page));
        if (params.limit) searchParams.append("limit", String(params.limit));
        return `search?${searchParams.toString()}`;
      },
      providesTags: ["Users"],
      keepUnusedDataFor: 30,
    }),

    addToTeam: builder.mutation<
      { success: boolean; message: string; data?: Profile },
      { ownerId: number; memberId: number }
    >({
      query: ({ ownerId, memberId }) => ({
        url: `${ownerId}/team`,
        method: "POST",
        body: { memberId },
      }),
      invalidatesTags: ["Profile", "Users"],
    }),

    getTeam: builder.query<
      { data: Profile[]; meta: { total: number } },
      number
    >({
      query: (ownerId) => `${ownerId}/team`,
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useVeryfcodeMutation,
  useAddUserMutation,
  useSearchUsersQuery,
  useAddToTeamMutation,
  useGetTeamQuery,
} = ProfileApi;
