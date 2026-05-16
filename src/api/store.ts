import { configureStore } from "@reduxjs/toolkit";
import { ProfileApi } from "./ProfileApi";
import { AuthApi } from "./AuthApi";
import { TaskApi } from "./TaskApi";

export const store = configureStore({
  reducer: {
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [TaskApi.reducerPath]: TaskApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    // добавьте другие редюсеры здесь, если будут
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ProfileApi.middleware,AuthApi.middleware,TaskApi.middleware),
});

// Типы для удобства
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;