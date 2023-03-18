import { axiosInstance } from "./../../../helpers/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  IAddTopic,
  ITopicParentInfo,
  ItopicType,
  IUpdateAccessTopic,
  IUpdateTopic,
} from "./topicTypes";
import { getRequestError } from "../../../store/helpers/getRequestError";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";

export const getTopicByParentID = createAsyncThunk(
  "topic/getAll",
  async (id: string | null, thunkApi) => {
    try {
      const response = await axiosInstance.get<{
        topics: ItopicType[];
        parentInfo: ITopicParentInfo | null;
      }>(`/api/topic/children/${id}`);
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

export const updateTopic = createAsyncThunk(
  "topic/update",
  async (req: IUpdateTopic, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(`/api/topic`, req);
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updateTopicAccess = createAsyncThunk(
  "topic/updateAccess",
  async (req: IUpdateAccessTopic, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/topic/access`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const createTopic = createAsyncThunk(
  "topic/create",
  async (req: IAddTopic, thunkApi) => {
    try {
      const response = await axiosInstanceToken.post<string>(`/api/topic`, req);
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const deleteTopic = createAsyncThunk(
  "topic/delete",
  async (topicID: string, thunkApi) => {
    try {
      const response = await axiosInstanceToken.delete<string>(
        `/api/topic/${topicID}`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
