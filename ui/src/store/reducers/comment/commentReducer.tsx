import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCommentByPostID } from "./commentCreateAction";
import { IComment, ICommentInitialState } from "./commentTypes";
import { IActionError } from "../../../store/types";

const initialState: ICommentInitialState = {
  comments: [],
  maxPage: 0,
  isLoading: false,
  error: "",
  statusError: 0,
};

export const CommentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getCommentByPostID.fulfilled,
        (
          state,
          action: PayloadAction<{ comments: IComment[]; maxPage: number }>
        ) => {
          state.comments = action.payload.comments;
          state.maxPage = action.payload.maxPage;
          state.isLoading = false;
        }
      )
      .addCase(getCommentByPostID.pending, (state) => {
        state.isLoading = true;
        state.error = "";
        state.statusError = 0;
      })
      .addCase(getCommentByPostID.rejected, (state, action) => {
        const payload = action.payload as IActionError;

        state.comments = [];
        state.maxPage = 0;
        state.isLoading = false;
        state.error = payload.message;
        state.statusError = payload.status;
      });
  },
});

export default CommentSlice.reducer;
