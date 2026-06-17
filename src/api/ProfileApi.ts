import type { Profile } from "../types/ProfileType";
import type {
  SearchUsersParams,
  SearchUsersResponse,
} from "../types/SearchType";
import { BASE_API_URL } from "./BaseApi";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCurrentUserId } from "../utils/utils.user.id";
import { getAuthToken } from "../utils/auth.storage";
import { extractAvatarFromPayload } from "../utils/avatar.utils";

type UpdateProfilePayload = Partial<Omit<Profile, "id" | "login" | "password">>;

export type AddUserPayload = {
  name: string;
  email: string;
  login: string;
  password: string;
};

type UpdateProfileResponse = {
  message?: string;
  user?: Profile;
};

const normalizeProfile = (raw: unknown): Profile => {
  const payload = raw as UpdateProfileResponse | Profile;
  const user = (payload as UpdateProfileResponse).user ?? payload;
  const profile = user as Profile & { aboutme?: string };
  const avatar = extractAvatarFromPayload(raw) || profile.avatar || "";

  return {
    ...profile,
    aboutMe: profile.aboutMe ?? profile.aboutme ?? "",
    avatar,
  };
};

const getProfileTag = () => {
  const userId = getCurrentUserId();
  return userId ? [{ type: "Profile" as const, id: userId }] : [{ type: "Profile" as const }];
};

export const ProfileApi = createApi({
  reducerPath: "Profile",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers) => {
      const token = getAuthToken();

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
      transformResponse: (response: unknown): Profile => normalizeProfile(response),
    }),

    updateProfile: builder.mutation<Profile, UpdateProfilePayload>({
      query: (userData) => ({
        url: "update_profile",
        method: "PATCH",
        body: userData,
      }),
      transformResponse: (response: unknown): Profile => normalizeProfile(response),
      invalidatesTags: () => getProfileTag(),
    }),

    updateAvatar: builder.mutation<Profile, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return {
          url: "update_avatar",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: unknown): Profile => normalizeProfile(response),
      async onQueryStarted(_file, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProfile } = await queryFulfilled;
          const userId = getCurrentUserId();

          if (!userId || !updatedProfile.avatar) return;

          dispatch(
            ProfileApi.util.updateQueryData("getProfile", userId, (draft) => {
              Object.assign(draft, updatedProfile);
              draft.avatar = updatedProfile.avatar;
            }),
          );
        } catch {
          /* ошибка загрузки — кэш не трогаем */
        }
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

    addUser: builder.mutation<Profile | void, AddUserPayload>({
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
      transformResponse: (response: unknown): SearchUsersResponse => {
        const payload = response as SearchUsersResponse;
        return {
          ...payload,
          data: Array.isArray(payload?.data)
            ? payload.data.map((item) => normalizeProfile(item))
            : [],
        };
      },
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
      transformResponse: (response: unknown) => {
        const payload = response as {
          data?: unknown[];
          meta?: { total: number };
        };
        const data = Array.isArray(payload?.data)
          ? payload.data.map((item) => normalizeProfile(item))
          : [];

        return {
          data,
          meta: payload?.meta ?? { total: data.length },
        };
      },
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
