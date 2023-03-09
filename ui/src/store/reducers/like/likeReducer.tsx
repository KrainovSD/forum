import { createSlice } from "@reduxjs/toolkit";
import { IActionError } from "store/types";
import { getLikeByCommentID } from "./likeActionCreator";
import { ILikeInitialState } from "./likeTypes";

const initialState: ILikeInitialState = {
  likes: null,
  isLoading: false,
  error: "",
  statusError: 0,
};

export const LikeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLikeByCommentID.fulfilled, (state, action) => {
        state.likes = action.payload;
        state.isLoading = false;
      })
      .addCase(getLikeByCommentID.pending, (state) => {
        state.isLoading = true;
        state.error = "";
        state.statusError = 0;
      })
      .addCase(getLikeByCommentID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.isLoading = false;
        state.error = payload.message;
        state.statusError = payload.status;
      });
  },
});

export default LikeSlice.reducer;
