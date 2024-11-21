import { createSlice } from "@reduxjs/toolkit";

const initialState = { email: "", username: "" };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.username = action.payload.username;
    },

    clearUser(state) {
      state.email = "";
      state.username = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
