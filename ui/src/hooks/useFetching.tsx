import { AxiosError } from "axios";
import { useState } from "react";

type IFetching = (
  callback: (...args: any[]) => any,
  setPopup?:
    | ((title: string, body: string, newCallback?: (() => void) | null) => void)
    | null,
  titlePopup?: string | null,
  callbackPopup?: (() => void) | null
) => {
  fetching: () => Promise<void>;
  isLoading: boolean;
  error: string;
  status: number;
};

const useFetching: IFetching = (
  callback,
  setPopup = null,
  titlePopup = null,
  callbackPopup = null
) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number>(0);

  const fetching = async () => {
    try {
      setIsLoading(true);
      await callback();
      setStatus(200);
      setError("");
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      const reqError = e as AxiosError;
      const reqStatus = reqError.response?.status || 500;
      const message =
        (reqError.response?.data as string) || "Сервер не отвечает!";
      setStatus(reqStatus);
      setError(message);
      if (setPopup && titlePopup) setPopup(titlePopup, message, callbackPopup);
    }
  };
  return { fetching, isLoading, error, status };
};

export default useFetching;
