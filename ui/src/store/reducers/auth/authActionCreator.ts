import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { ICheckAuthData } from "./authTypes";
import { AxiosError } from "axios";

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.post<ICheckAuthData>(
        "/api/auth/token"
      );
      return response.data;
    } catch (e) {
      const error = e as AxiosError;
      const status = error.response?.status;
      const message = error.response?.data;
      return thunkApi.rejectWithValue({
        status: status,
        message: message,
      });
    }
  }
);
