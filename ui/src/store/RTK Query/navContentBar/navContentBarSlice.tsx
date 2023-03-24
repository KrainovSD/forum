import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosRequestConfig } from "axios";
import { IParentInfo } from "components/PreContentBar/PreContentBar";
import { axiosInstanceNoStrictToken } from "../../../helpers/axiosInstanceNoStrictToken";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstanceNoStrictToken(url, {
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const navContentBarSlice = createApi({
  reducerPath: "navContentBar",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getPostParents: builder.query<IParentInfo, string>({
      query: (id) => ({ url: `api/post/parent/${id}`, method: "get" }),
    }),
    getTopicParents: builder.query<IParentInfo, string>({
      query: (id) => ({ url: `api/topic/parent/${id}`, method: "get" }),
    }),
  }),
});

export const { useLazyGetPostParentsQuery, useLazyGetTopicParentsQuery } =
  navContentBarSlice;
