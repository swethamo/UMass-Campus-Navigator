import { createSlice } from "@reduxjs/toolkit";

interface Chat {
  message: string;
  response: string;
}

export const chatSlice = createSlice({
  name: "chat",
  initialState: null as Chat | null,
  reducers: {
    setChat: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setChat } = chatSlice.actions;
export default chatSlice.reducer;
