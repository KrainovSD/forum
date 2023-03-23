import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { getRequestError } from "../../../store/helpers/getRequestError";
import {
  ICreateMessage,
  IGetMessage,
  IMessage,
  ISession,
  IUpdateMessage,
} from "./messageTypes";

export const getSession = createAsyncThunk(
  "message/session",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.get<ISession[]>(
        "/api/message/last"
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const getMessage = createAsyncThunk(
  "message/get",
  async (req: IGetMessage, thunkApi) => {
    try {
      const response = await axiosInstanceToken.get<{
        messages: IMessage[];
        maxPage: number;
      }>(`/api/message/bySession/${req.sessionID}`, {
        params: { page: req.page },
      });
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const createMessage = createAsyncThunk(
  "message/create",
  async (req: ICreateMessage, thunkApi) => {
    try {
      const response = await axiosInstanceToken.post<string>(
        "/api/message",
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const updateMessage = createAsyncThunk(
  "message/update",
  async (req: IUpdateMessage, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        "/api/message",
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "message/delete",
  async (messageID: string[], thunkApi) => {
    try {
      const response = await axiosInstanceToken.post<string>(
        `/api/message/delete`,
        { messageID: messageID }
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const deleteSession = createAsyncThunk(
  "session/delete",
  async (sessionID: string, thunkApi) => {
    try {
      const response = await axiosInstanceToken.delete<string>(
        `/api/message/session/${sessionID}`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
