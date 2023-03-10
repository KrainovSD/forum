import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getMessageByUserID = createAsyncThunk(
  "message/byUser",
  async (id: string, thunkApi) => {
    try {
    } catch (e) {
      const error = e as AxiosError;
      const message = error.response?.data || "";
      const status = error.response?.status || 0;
      return thunkApi.rejectWithValue({ message, status });
    }
  }
);
