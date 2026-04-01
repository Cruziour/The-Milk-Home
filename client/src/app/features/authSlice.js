import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
  user: savedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    clearUser: state => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setAuth, clearUser } = authSlice.actions;
export default authSlice.reducer;
