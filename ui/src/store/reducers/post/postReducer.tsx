import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getLastPosts,
  getPostByID,
  getPostByTopicID,
  updatePost,
  updatePostClosed,
  updatePostFixed,
  updatePostVerify,
} from "./postActionCreator";
import { IPostInitialState, IPostTypes } from "./postTypes";
import { IActionError } from "../../../store/types";

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
      .addCase(getPostByTopicID.fulfilled, (state, action) => {
        if (action.payload?.posts) state.posts = action.payload.posts;
        if (action.payload?.maxPage) state.maxPage = action.payload.maxPage;
        state.isSmallLoading = false;
      })
      .addCase(getPostByTopicID.pending, (state) => {
        state.isSmallLoading = true;
        state.error = "";
        state.response = "";
        state.updated = false;
        state.statusError = 0;
        state.currentPost = null;
      })
      .addCase(getPostByTopicID.rejected, (state, action) => {
        const payload = action.payload as {
          message: string;
          status: number;
        };
        state.posts = [];
        state.error = payload.message;
        state.statusError = payload.status;
        state.isSmallLoading = false;
      })
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

const fulfilledAction = (
  state: IPostInitialState,
  action: { payload: string }
) => {
  state.isLoading = false;
  state.response = action.payload;
  state.updated = true;
};
const pendingAction = (state: IPostInitialState) => {
  state.response = "";
  state.isLoading = true;
  state.statusError = 0;
  state.updated = false;
};
const rejectedAction = (
  state: IPostInitialState,
  action: PayloadAction<unknown>
) => {
  const payload = action.payload as IActionError;
  state.isLoading = false;
  state.statusError = payload.status;
  state.response = payload.message;
};

export default postSlice.reducer;
