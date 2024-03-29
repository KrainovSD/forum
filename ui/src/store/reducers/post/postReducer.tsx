import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getAllPosts,
  getLastPosts,
  getPostByID,
  getPostByTopicID,
  getPostByUserID,
  updatePost,
  updatePostClosed,
  updatePostFixed,
  updatePostVerify,
} from "./postActionCreator";
import { IPostInitialState, IPostsTypes, IPostTypes } from "./postTypes";
import { IActionError } from "../../../store/types";
import {
  fulfilledAction,
  pendingAction,
  rejectedAction,
} from "../../../store/helpers/typeActions";

const initialState: IPostInitialState = {
  posts: [],
  currentPost: null,
  lastPosts: [],
  maxPage: 1,
  updated: false,
  response: "",
  isLoading: false,
  isSmallLoading: false,
  error: "",
  statusError: 0,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPostByTopicID.fulfilled, postFulfilledAction)
      .addCase(getPostByTopicID.pending, postPendingAction)
      .addCase(getPostByTopicID.rejected, postRejectedAction)
      .addCase(
        getPostByID.fulfilled,
        (state, action: PayloadAction<IPostTypes>) => {
          state.isLoading = false;
          state.currentPost = action.payload;
        }
      )
      .addCase(getPostByID.pending, (state) => {
        state.posts = [];
        state.error = "";
        state.response = "";
        state.isLoading = true;
        state.updated = false;
        state.statusError = 0;
        state.currentPost = null;
      })
      .addCase(getPostByID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.isLoading = false;
      })
      .addCase(getLastPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastPosts = action.payload;
      })
      .addCase(getLastPosts.pending, (state) => {
        state.lastPosts = [];
        state.error = "";
        state.response = "";
        state.updated = false;
        state.isLoading = true;
        state.statusError = 0;
      })
      .addCase(getLastPosts.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.isLoading = false;
      })
      .addCase(getAllPosts.fulfilled, postFulfilledAction)
      .addCase(getAllPosts.pending, postPendingAction)
      .addCase(getAllPosts.rejected, postRejectedAction)
      .addCase(getPostByUserID.fulfilled, postFulfilledAction)
      .addCase(getPostByUserID.pending, postPendingAction)
      .addCase(getPostByUserID.rejected, postRejectedAction)
      .addCase(updatePost.fulfilled, fulfilledAction)
      .addCase(updatePost.pending, pendingAction)
      .addCase(updatePost.rejected, rejectedAction)
      .addCase(updatePostClosed.fulfilled, fulfilledAction)
      .addCase(updatePostClosed.pending, pendingAction)
      .addCase(updatePostClosed.rejected, rejectedAction)
      .addCase(updatePostFixed.fulfilled, fulfilledAction)
      .addCase(updatePostFixed.pending, pendingAction)
      .addCase(updatePostFixed.rejected, rejectedAction)
      .addCase(updatePostVerify.fulfilled, fulfilledAction)
      .addCase(updatePostVerify.pending, pendingAction)
      .addCase(updatePostVerify.rejected, rejectedAction)
      .addCase(createPost.fulfilled, fulfilledAction)
      .addCase(createPost.pending, pendingAction)
      .addCase(createPost.rejected, rejectedAction)
      .addCase(deletePost.fulfilled, fulfilledAction)
      .addCase(deletePost.pending, pendingAction)
      .addCase(deletePost.rejected, rejectedAction);
  },
});

const postFulfilledAction = (
  state: IPostInitialState,
  action: PayloadAction<{ maxPage: number; posts: IPostsTypes[] }>
) => {
  state.posts = action.payload.posts;
  state.maxPage = action.payload.maxPage;
  state.isSmallLoading = false;
};

const postPendingAction = (state: IPostInitialState) => {
  state.isSmallLoading = true;
  state.error = "";
  state.response = "";
  state.updated = false;
  state.statusError = 0;
  state.currentPost = null;
};

const postRejectedAction = (
  state: IPostInitialState,
  action: PayloadAction<unknown>
) => {
  const payload = action.payload as {
    message: string;
    status: number;
  };
  state.posts = [];
  state.error = payload.message;
  state.statusError = payload.status;
  state.isSmallLoading = false;
};

export default postSlice.reducer;
