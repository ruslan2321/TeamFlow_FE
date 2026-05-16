import type { Profile } from "./ProfileType";

export interface SearchUsersResponse {
  data: Profile[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchUsersParams {
  q?: string; // поисковый запрос
  page?: number; // страница (по умолчанию 1)
  limit?: number; // лимит (по умолчанию 20)
}
