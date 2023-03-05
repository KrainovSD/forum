import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { IPostsTypes, IPostTypes } from "./postTypes";

interface reqGetPostByTopicID {
  topicID: number;
  page: string;
  filter: string;
}

export const getPostByTopicID = createAsyncThunk(
  "topic/getByTopic",
  async (req: reqGetPostByTopicID, thunkApi) => {
    try {
      const response = await axiosInstance.get<{
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
      const error = e as AxiosError;
      const status: number = error.response?.status || 0;
      const message: string = (error.response?.data as string) || "";
      return thunkApi.rejectWithValue({
        message,
        status,
      });
    }
  }
);

export const getPostByID = createAsyncThunk(
  "topic/getByID",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.get<IPostTypes>(
        `/api/post/byID/${id}`
      );
      return response.data;
    } catch (e) {
      const error = e as AxiosError;
      const status: number = error.response?.status || 0;
      const message: string = (error.response?.data as string) || "";
      return thunkApi.rejectWithValue({
        message,
        status,
      });
    }
  }
);
