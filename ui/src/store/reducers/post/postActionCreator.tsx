import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { axiosInstanceNoStrictToken } from "../../../helpers/axiosInstanceNoStrictToken";
import {
  IAdminUpdatePost,
  ICreatePost,
  ILastPost,
  IPostsTypes,
  IPostTypes,
  IUpdatePost,
} from "./postTypes";
import { getRequestError } from "../../../store/helpers/getRequestError";

interface reqGetPostByTopicID {
  topicID: number;
  page: string;
  filter: string;
}

export const getPostByTopicID = createAsyncThunk(
  "post/getByTopic",
  async (req: reqGetPostByTopicID, thunkApi) => {
    try {
      const response = await axiosInstanceNoStrictToken.get<{
        posts: IPostsTypes[];
        maxPage: number;
      }>(`/api/post/byTopic/${req.topicID}`, {
        params: {
          page: req.page,
          filter: req.filter,
        },
      });
      return {
        posts: response.data.posts,
        maxPage: response.data.maxPage,
      };
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const getPostByID = createAsyncThunk(
  "post/getByID",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstanceNoStrictToken.get<IPostTypes>(
        `/api/post/byID/${id}`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const getLastPosts = createAsyncThunk(
  "post/last",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get<ILastPost[]>(`/api/post/last`);
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/update",
  async (req: IUpdatePost, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/post/title`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updatePostClosed = createAsyncThunk(
  "post/closed",
  async (req: IAdminUpdatePost, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/post/closed`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const updatePostFixed = createAsyncThunk(
  "post/fixed",
  async (req: IAdminUpdatePost, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/post/fixed`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const updatePostVerify = createAsyncThunk(
  "post/verify",
  async (req: IAdminUpdatePost, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/post/verified`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const createPost = createAsyncThunk(
  "post/create",
  async (req: ICreatePost, thunkApi) => {
    try {
      const response = await axiosInstanceToken.post<string>(`/api/post`, req);
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const deletePost = createAsyncThunk(
  "post/delete",
  async (postID: string, thunkApi) => {
    try {
      const response = await axiosInstanceToken.delete<string>(
        `/api/post/${postID}`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
