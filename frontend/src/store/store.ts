import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.ts";
import buildingReducer from "./buildingsSlice.ts";
import chatReducer from "./chatSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    buildings: buildingReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
