import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getPostByID, getPostByTopicID } from "./postActionCreator";
import { postInitialState, IPostTypes } from "./postTypes";
import { IActionError } from "../../../store/types";

const initialState: postInitialState = {
  posts: [],
  currentPost: null,
  maxPage: 1,
  isLoading: false,
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
        state.isLoading = false;
      })
      .addCase(getPostByTopicID.pending, (state) => {
        state.isLoading = true;
        state.error = "";
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
        state.isLoading = false;
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
        state.statusError = 0;
        state.currentPost = null;
      })
      .addCase(getPostByID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.isLoading = false;
        state.currentPost = null;
      });
  },
});

export default postSlice.reducer;
