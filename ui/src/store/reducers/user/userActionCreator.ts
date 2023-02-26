import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { checkAuthData } from "./userTypes";
import { AxiosError } from "axios";

/*export const checkAuth = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(userSlice.actions.checkAuthPending());
    const response = await axiosInstanceToken.post<checkAuthData>(
      "/api/auth/token"
    );
    dispatch(userSlice.actions.checkAuthSuccess(response.data));
  } catch (e) {
    console.log(e);
    dispatch(userSlice.actions.checkAuthError("Вы не авторизованы!"));
  }
};*/

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstanceToken.post<checkAuthData>(
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
