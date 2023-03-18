import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstanceToken } from "../../../helpers/axiosInstanceToken";
import { axiosInstanceNoStrictToken } from "../../../helpers/axiosInstanceNoStrictToken";
import {
  IComment,
  ICreateComment,
  IGetAllComments,
  IReqGetCommentByPost,
  IUpdateComment,
  IUpdateCommentFixed,
  IUpdateCommentVerified,
} from "./commentTypes";
import { getRequestError } from "../../helpers/getRequestError";

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
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
export const getAllComments = createAsyncThunk(
  "comment/all",
  async (req: IGetAllComments, thunkApi) => {
    try {
      const response = await axiosInstanceToken.get<{
        maxPage: number;
        comments: IComment[];
      }>(`/api/comment/all`, {
        params: {
          page: req.page,
          filter: req.filter,
        },
      });
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const createComment = createAsyncThunk(
  "comment/create",
  async (req: ICreateComment, thunkApi) => {
    try {
      const response = await axiosInstanceToken.post<string>(
        `/api/comment`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/update",
  async (req: IUpdateComment, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/comment/body`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updateCommentVerified = createAsyncThunk(
  "comment/updateVerified",
  async (req: IUpdateCommentVerified, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/comment/verified`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const updateCommentFixed = createAsyncThunk(
  "comment/updateFixed",
  async (req: IUpdateCommentFixed, thunkApi) => {
    try {
      const response = await axiosInstanceToken.put<string>(
        `/api/comment/fixed`,
        req
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (commentID: string, thunkApi) => {
    try {
      const response = await axiosInstanceToken.delete<string>(
        `/api/comment/${commentID}`
      );
      return response.data;
    } catch (e) {
      const reqError = getRequestError(e);
      return thunkApi.rejectWithValue(reqError);
    }
  }
);
