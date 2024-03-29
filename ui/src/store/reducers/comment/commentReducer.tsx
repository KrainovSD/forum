import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentByPostID,
  getCommentByUserID,
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
      .addCase(getCommentByPostID.fulfilled, commentFulfilledAction)
      .addCase(getCommentByPostID.pending, commentPendingAction)
      .addCase(getCommentByPostID.rejected, commentRejectedAction)
      .addCase(getAllComments.fulfilled, commentFulfilledAction)
      .addCase(getAllComments.pending, commentPendingAction)
      .addCase(getAllComments.rejected, commentRejectedAction)
      .addCase(getCommentByUserID.fulfilled, commentFulfilledAction)
      .addCase(getCommentByUserID.pending, commentPendingAction)
      .addCase(getCommentByUserID.rejected, commentRejectedAction)

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

const commentFulfilledAction = (
  state: ICommentInitialState,
  action: PayloadAction<{ comments: IComment[]; maxPage: number }>
) => {
  state.comments = action.payload.comments;
  state.maxPage = action.payload.maxPage;
  state.isSmallLoading = false;
};
const commentPendingAction = (state: ICommentInitialState) => {
  state.isSmallLoading = true;
  state.error = "";
  state.response = "";
  state.updated = false;
  state.statusError = 0;
};
const commentRejectedAction = (
  state: ICommentInitialState,
  action: PayloadAction<unknown>
) => {
  const payload = action.payload as IActionError;
  state.comments = [];
  state.maxPage = 0;
  state.isSmallLoading = false;
  state.error = payload.message;
  state.statusError = payload.status;
};

export default CommentSlice.reducer;
