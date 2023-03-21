import { createSlice } from "@reduxjs/toolkit";
import {
  fulfilledAction,
  pendingAction,
  rejectedAction,
} from "../../../store/helpers/typeActions";
import { IActionError } from "../../../store/types";
import {
  deleteAvatar,
  deleteBackImg,
  getMyUserInfo,
  getUserByID,
  getUserContent,
  updateAvatar,
  updateBackImg,
  updateEmail,
  updateEmailNote,
  updateNickName,
  updatePassword,
  updatePasswordForgot,
  updatePasswordNote,
  updateUserName,
} from "./userActionCreator";
import { IUserInitialState } from "./userTypes";

const initialState: IUserInitialState = {
  userInfo: null,
  selectedUserInfo: null,
  userContent: [],
  isLoading: false,
  response: "",
  updated: false,
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
        state.response = "";
        state.updated = false;
      })
      .addCase(getUserByID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.selectedUserInfo = null;
        state.isLoading = false;
      })
      .addCase(getMyUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isLoading = false;
      })
      .addCase(getMyUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = "";
        state.statusError = 0;
        state.response = "";
        state.updated = false;
      })
      .addCase(getMyUserInfo.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.userInfo = null;
        state.isLoading = false;
      })
      .addCase(getUserContent.fulfilled, (state, action) => {
        state.userContent = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserContent.pending, (state) => {
        state.isLoading = true;
        state.error = "";
        state.statusError = 0;
        state.response = "";
        state.updated = false;
      })
      .addCase(getUserContent.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.userContent = [];
        state.isLoading = false;
      })
      .addCase(updatePasswordNote.fulfilled, fulfilledAction)
      .addCase(updatePasswordNote.pending, pendingAction)
      .addCase(updatePasswordNote.rejected, rejectedAction)
      .addCase(updatePassword.fulfilled, fulfilledAction)
      .addCase(updatePassword.pending, pendingAction)
      .addCase(updatePassword.rejected, rejectedAction)
      .addCase(updateEmailNote.fulfilled, fulfilledAction)
      .addCase(updateEmailNote.pending, pendingAction)
      .addCase(updateEmailNote.rejected, rejectedAction)
      .addCase(updateEmail.fulfilled, fulfilledAction)
      .addCase(updateEmail.pending, pendingAction)
      .addCase(updateEmail.rejected, rejectedAction)
      .addCase(updateUserName.fulfilled, fulfilledAction)
      .addCase(updateUserName.pending, pendingAction)
      .addCase(updateUserName.rejected, rejectedAction)
      .addCase(updateNickName.fulfilled, fulfilledAction)
      .addCase(updateNickName.pending, pendingAction)
      .addCase(updateNickName.rejected, rejectedAction)
      .addCase(updatePasswordForgot.fulfilled, fulfilledAction)
      .addCase(updatePasswordForgot.pending, pendingAction)
      .addCase(updatePasswordForgot.rejected, rejectedAction)
      .addCase(updateAvatar.fulfilled, fulfilledAction)
      .addCase(updateAvatar.pending, pendingAction)
      .addCase(updateAvatar.rejected, rejectedAction)
      .addCase(updateBackImg.fulfilled, fulfilledAction)
      .addCase(updateBackImg.pending, pendingAction)
      .addCase(updateBackImg.rejected, rejectedAction)
      .addCase(deleteAvatar.fulfilled, fulfilledAction)
      .addCase(deleteAvatar.pending, pendingAction)
      .addCase(deleteAvatar.rejected, rejectedAction)
      .addCase(deleteBackImg.fulfilled, fulfilledAction)
      .addCase(deleteBackImg.pending, pendingAction)
      .addCase(deleteBackImg.rejected, rejectedAction);
  },
});

export default userSlice.reducer;
