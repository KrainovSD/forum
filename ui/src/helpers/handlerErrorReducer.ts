import { AxiosError } from "axios";

export const handlerErrorReducer = (
  e: any,
  thunkApi: GetThunkAPI<AsyncThunkConfig>
) => {
  const error = e as AxiosError;
  const message = error.response?.data || "";
  const status = error.response?.status || 0;
  return thunkApi.rejectWithValue({
    message,
    status,
  });
};
