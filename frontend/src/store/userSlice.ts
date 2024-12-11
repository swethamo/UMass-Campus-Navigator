import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../../models/User";
import { googleLogout } from "@react-oauth/google";

export const userSlice = createSlice({
  name: "user",
  initialState: null as User | null,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    logoutUser: () => {
      googleLogout();
      return null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
