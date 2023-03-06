import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { ISelectedUserInfo, IUserInfo } from "./userTypes";

export const getUserByID = createAsyncThunk(
  "user/getByID",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.get<ISelectedUserInfo>(
        `/api/user/${id}`
      );
      return response.data;
    } catch (e) {
      const error = e as AxiosError;
      const message = error.response?.data || "";
      const status = error.response?.status || 0;
      return thunkApi.rejectWithValue({
        message,
        status,
      });
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
      const error = e as AxiosError;
      const message = error.response?.data || "";
      const status = error.response?.status || 0;
      return thunkApi.rejectWithValue({
        message,
        status,
      });
    }
  }
);
