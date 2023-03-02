import { axiosInstance } from "./../../../helpers/axiosInstance";
import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { topicType } from "./topicTypes";

export const getTopicByID = createAsyncThunk(
  "post/getAll",
  async (id: string | null, thunkApi) => {
    try {
      const response = await axiosInstance.get<{
        topics: topicType[];
        parentTitle: null | string;
      }>(`/api/topic/${id}`);
      return {
        topic: response.data.topics,
        parentID: id,
        parentTitle: response.data.parentTitle,
      };
    } catch (e) {
      const error = e as AxiosError;
      const message = error.response?.data || "Сервер не отвечает!";
      const statusError = error.response?.status || 500;
      return thunkApi.rejectWithValue({
        message,
        statusError,
      });
    }
  }
);
