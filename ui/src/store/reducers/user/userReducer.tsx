import { createSlice } from "@reduxjs/toolkit";
import { IActionError } from "../../../store/types";
import { getMyUserInfo, getUserByID } from "./userActionCreator";
import { IUserInitialState } from "./userTypes";

const initialState: IUserInitialState = {
  userInfo: null,
  selectedUserInfo: null,
  isLoading: false,
  error: "",
  statusError: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByID.fulfilled, (state, action) => {
        state.selectedUserInfo = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserByID.pending, (state) => {
        state.isLoading = true;
        state.error = "";
        state.statusError = 0;
      })
      .addCase(getUserByID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.selectedUserInfo = null;
      })
      .addCase(getMyUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isLoading = false;
      })
      .addCase(getMyUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = "";
        state.statusError = 0;
      })
      .addCase(getMyUserInfo.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.userInfo = null;
      });
  },
});

export default userSlice.reducer;
