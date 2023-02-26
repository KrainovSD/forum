import { checkAuth } from "./userActionCreator";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuthData, checkAuthError } from "./userTypes";

interface UserState {
  auth: boolean;
  role: string;
  isLoading: boolean;
  statusError: number;
  error: string;
}

const initialState: UserState = {
  auth: false,
  role: "guest",
  isLoading: false,
  statusError: 0,
  error: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.auth = false;
      state.role = "guest";
    },
    setAuth: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
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
        state.isLoading = true;
      })
      .addCase(
        checkAuth.rejected,
        (state, action: PayloadAction<checkAuthError | unknown>) => {
          const payload = action.payload as checkAuthError;
          state.auth = false;
          state.role = "guest";
          state.isLoading = false;
          state.statusError = payload.status;
          state.error = payload.message;
        }
      );
  },
});

export default userSlice.reducer;
