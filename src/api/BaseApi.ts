const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error(
    "VITE_API_URL is not set. Use https://team-flow-be.vercel.app on prod or http://localhost:3000 locally.",
  );
}

export const BASE_API_URL = rawApiUrl.replace(/\/$/, "");
