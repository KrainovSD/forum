import { createSlice } from "@reduxjs/toolkit";
import { IActionError } from "store/types";
import {
  createLike,
  deleteLike,
  getLikeByCommentID,
} from "./likeActionCreator";
import { ILikeInitialState } from "./likeTypes";

const initialState: ILikeInitialState = {
  likes: [],
  isLoading: false,
  updated: false,
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
        state.likes = [];
      })
      .addCase(getLikeByCommentID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.isLoading = false;
        state.error = payload.message;
        state.statusError = payload.status;
      })
      .addCase(createLike.fulfilled, (state) => {
        state.isLoading = false;
        state.updated = true;
      })
      .addCase(createLike.pending, (state) => {
        state.isLoading = true;
        state.updated = false;
      })
      .addCase(createLike.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteLike.fulfilled, (state) => {
        state.isLoading = false;
        state.updated = true;
      })
      .addCase(deleteLike.pending, (state) => {
        state.isLoading = true;
        state.updated = false;
      })
      .addCase(deleteLike.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default LikeSlice.reducer;
