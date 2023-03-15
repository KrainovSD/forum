import { checkAuth } from "./authActionCreator";
import { createSlice } from "@reduxjs/toolkit";
import { IAuthInitialState, ICheckAuthError } from "./authTypes";
import { IActionError } from "../../../store/types";

const initialState: IAuthInitialState = {
  auth: false,
  isLoading: false,
  statusError: 0,
  error: "",
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.auth = false;
      state.statusError = 0;
      state.error = "";
      localStorage.removeItem("token");
    },
    setAuth: (state) => {
      state.statusError = 0;
      state.error = "";
      state.auth = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state) => {
        state.isLoading = false;
        state.statusError = 0;
        state.error = "";
        state.auth = true;
      })
      .addCase(checkAuth.pending, (state) => {
        state.statusError = 0;
        state.error = "";
        state.isLoading = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.auth = false;
        state.isLoading = false;
        state.statusError = payload.status;
        state.error = payload.message;
      });
  },
});

export default authSlice.reducer;
