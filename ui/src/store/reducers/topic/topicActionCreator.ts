import { axiosInstance } from "./../../../helpers/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ITopicParentInfo, ItopicType } from "./topicTypes";
import { getRequestError } from "../../../store/helpers/getRequestError";

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
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
