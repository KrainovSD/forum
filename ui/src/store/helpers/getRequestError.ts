import { AxiosError } from "axios";
export const getRequestError = (e: any) => {
  const error = e as AxiosError;
  const status = error.response?.status || 500;
  const message = error.response?.data || "";
  return { status, message };
};
