import { checkAuth } from "./authActionCreator";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authState, checkAuthData, checkAuthError } from "./authTypes";

const initialState: authState = {
  auth: false,
  role: "guest",
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
      state.role = "guest";
      state.statusError = 0;
      state.error = "";
    },
    setAuth: (state, action: PayloadAction<string>) => {
      state.statusError = 0;
      state.error = "";
      state.auth = true;
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        checkAuth.fulfilled,
        (state, action: PayloadAction<checkAuthData>) => {
          state.isLoading = false;
          state.statusError = 0;
          state.error = "";
          state.auth = true;
          state.role = action.payload.role;
        }
      )
      .addCase(checkAuth.pending, (state) => {
        state.statusError = 0;
        state.error = "";
        state.isLoading = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        const payload = action.payload as checkAuthError;
        state.auth = false;
        state.role = "guest";
        state.isLoading = false;
        state.statusError = payload.status;
        state.error = payload.message;
      });
  },
});

export default authSlice.reducer;
