import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { ILike } from "./likeTypes";
import { getRequestError } from "../../helpers/getRequestError";

export const getLikeByCommentID = createAsyncThunk(
  "like/getByComment",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.get<ILike[]>(
        `/api/like/byComment/${id}`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

interface ILikeReq {
  commentID: string;
  authorCommentID: string;
}

export const createLike = createAsyncThunk(
  "like/create",
  async (req: ILikeReq, thunkApi) => {
    try {
      const response = await axiosInstanceToken.post("/api/like", {
        commentID: req.commentID,
        authorCommentID: req.authorCommentID,
      });
      return true;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const deleteLike = createAsyncThunk(
  "like/delete",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstanceToken.delete(`/api/like/${id}`);
      return true;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
