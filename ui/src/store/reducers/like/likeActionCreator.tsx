import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { ILike } from "./likeTypes";
import { handlerErrorReducer } from "../../../helpers/handlerErrorReducer";

export const getLikeByCommentID = createAsyncThunk(
  "like/getByComment",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.get<ILike[]>(
        `/api/like/byComment/${id}`
      );
      return response.data;
    } catch (e) {
      return handlerErrorReducer(e, thunkApi);
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
      return handlerErrorReducer(e, thunkApi);
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
      return handlerErrorReducer(e, thunkApi);
    }
  }
);
