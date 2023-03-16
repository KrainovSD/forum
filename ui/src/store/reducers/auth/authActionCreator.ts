import { getRequestError } from "./../../helpers/getRequestError";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { ICheckAuthData } from "./authTypes";

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.post<ICheckAuthData>(
        "/api/auth/token"
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
