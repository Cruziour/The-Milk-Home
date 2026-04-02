import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import milkEntryReducer from "./features/milkEntrySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    milkEntries: milkEntryReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
