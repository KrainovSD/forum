import { createAsyncThunk } from "@reduxjs/toolkit";

import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { axiosInstance } from "../../../helpers/axiosInstance";
import {
  ILastUserContent,
  ISelectedUserInfo,
  IUpdateEmail,
  IUpdatePassword,
  IUserInfo,
} from "./userTypes";
import { getRequestError } from "../../../store/helpers/getRequestError";

export const getUserByID = createAsyncThunk(
  "user/getByID",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.get<ISelectedUserInfo>(
        `/api/user/${id}`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const getMyUserInfo = createAsyncThunk(
  "user/getMe",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.get<IUserInfo>(`/api/user/me`);
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const getUserContent = createAsyncThunk(
  "user/content",
  async (userID: string, thunkApi) => {
    try {
      const response = await axiosInstance.get<ILastUserContent[]>(
        `/api/user/content/${userID}`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updatePasswordNote = createAsyncThunk(
  "user/passwordNote",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/user/password/note`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const updatePasswordForgot = createAsyncThunk(
  "user/passwordForgot",
  async (email: string, thunkApi) => {
    try {
      const response = await axiosInstance.put<string>(
        `/api/user/password/forgot`,
        { email }
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const updateEmailNote = createAsyncThunk(
  "user/emailNote",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/user/email/note`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/password",
  async (req: IUpdatePassword, thunkApi) => {
    try {
      const response = await axiosInstance.put<string>(
        `/api/user/password`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const updateEmail = createAsyncThunk(
  "user/email",
  async (req: IUpdateEmail, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/user/email`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updateNickName = createAsyncThunk(
  "user/nick",
  async (nickName: string, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/user/nickName`,
        { nickName }
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const updateUserName = createAsyncThunk(
  "user/name",
  async (userName: string, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/user/userName`,
        { userName }
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "user/update/avatar",
  async (file: FormData, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/user/avatar`,
        file
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const updateBackImg = createAsyncThunk(
  "user/update/backImg",
  async (file: FormData, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/user/backImg`,
        file
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const deleteAvatar = createAsyncThunk(
  "user/delete",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.delete<string>(
        `/api/user/avatar`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const deleteBackImg = createAsyncThunk(
  "user/delete/backImg",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.delete<string>(
        `/api/user/backImg`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
