import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getRequestError } from "../../../store/helpers/getRequestError";

export const getMessageByUserID = createAsyncThunk(
  "message/byUser",
  async (id: string, thunkApi) => {
    try {
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
