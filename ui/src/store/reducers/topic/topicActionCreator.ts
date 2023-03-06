import { axiosInstance } from "./../../../helpers/axiosInstance";
import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ITopicParentInfo, ItopicType } from "./topicTypes";

export const getTopicByID = createAsyncThunk(
  "post/getAll",
  async (id: string | null, thunkApi) => {
    try {
      const response = await axiosInstance.get<{
        topics: ItopicType[];
        parentInfo: ITopicParentInfo | null;
      }>(`/api/topic/getChildren/${id}`);
      return {
        topics: response.data.topics,
        parentInfo: response.data.parentInfo,
      };
    } catch (e) {
      const error = e as AxiosError;
      const message = error.response?.data || "Сервер не отвечает!";
      const status = error.response?.status || 500;
      return thunkApi.rejectWithValue({
        message,
        status,
      });
    }
  }
);
