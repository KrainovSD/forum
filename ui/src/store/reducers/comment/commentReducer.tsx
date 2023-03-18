import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentByPostID,
  updateComment,
  updateCommentFixed,
  updateCommentVerified,
} from "./commentCreateAction";
import { IComment, ICommentInitialState } from "./commentTypes";
import { IActionError } from "../../../store/types";
import {
  fulfilledAction,
  pendingAction,
  rejectedAction,
} from "../../../store/helpers/typeActions";

const initialState: ICommentInitialState = {
  comments: [],
  maxPage: 0,
  updated: false,
  response: "",
  isLoading: false,
  isSmallLoading: false,
  error: "",
  statusError: 0,
};

export const CommentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommentByPostID.fulfilled, (state, action) => {
        state.comments = action.payload.comments;
        state.maxPage = action.payload.maxPage;
        state.isSmallLoading = false;
      })
      .addCase(getCommentByPostID.pending, (state) => {
        state.isSmallLoading = true;
        state.error = "";
        state.response = "";
        state.updated = false;
        state.statusError = 0;
      })
      .addCase(getCommentByPostID.rejected, (state, action) => {
        const payload = action.payload as IActionError;

        state.comments = [];
        state.maxPage = 0;
        state.isSmallLoading = false;
        state.error = payload.message;
        state.statusError = payload.status;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.comments = action.payload.comments;
        state.maxPage = action.payload.maxPage;
        state.isSmallLoading = false;
      })
      .addCase(getAllComments.pending, (state) => {
        state.isSmallLoading = true;
        state.error = "";
        state.response = "";
        state.updated = false;
        state.statusError = 0;
      })
      .addCase(getAllComments.rejected, (state, action) => {
        const payload = action.payload as IActionError;

        state.comments = [];
        state.maxPage = 0;
        state.isSmallLoading = false;
        state.error = payload.message;
        state.statusError = payload.status;
      })
      .addCase(createComment.fulfilled, fulfilledAction)
      .addCase(createComment.pending, pendingAction)
      .addCase(createComment.rejected, rejectedAction)
      .addCase(updateComment.fulfilled, fulfilledAction)
      .addCase(updateComment.pending, pendingAction)
      .addCase(updateComment.rejected, rejectedAction)
      .addCase(updateCommentVerified.fulfilled, fulfilledAction)
      .addCase(updateCommentVerified.pending, pendingAction)
      .addCase(updateCommentVerified.rejected, rejectedAction)
      .addCase(updateCommentFixed.fulfilled, fulfilledAction)
      .addCase(updateCommentFixed.pending, pendingAction)
      .addCase(updateCommentFixed.rejected, rejectedAction)
      .addCase(deleteComment.fulfilled, fulfilledAction)
      .addCase(deleteComment.pending, pendingAction)
      .addCase(deleteComment.rejected, rejectedAction);
  },
});

export default CommentSlice.reducer;
