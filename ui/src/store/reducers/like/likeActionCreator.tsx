import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { ILike } from "./likeTypes";

export const getLikeByCommentID = createAsyncThunk(
  "like/getByComment",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.get<ILike[]>(
        `/api/like/byComment/${id}`
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
