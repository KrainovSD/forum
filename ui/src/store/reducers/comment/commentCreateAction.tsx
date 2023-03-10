import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstanceNoStrictToken } from "../../../helpers/axiosInstanceNoStrictToken";
import { IComment, IReqGetCommentByPost } from "./commentTypes";

export const getCommentByPostID = createAsyncThunk(
  "comment/getByPost",
  async (req: IReqGetCommentByPost, thunkApi) => {
    try {
      const response = await axiosInstanceNoStrictToken.get<{
        maxPage: number;
        comments: IComment[];
      }>(`/api/comment/byPost/${req.id}`, {
        params: {
          page: req.page,
        },
      });
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
