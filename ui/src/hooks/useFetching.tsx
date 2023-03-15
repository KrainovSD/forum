import { AxiosError } from "axios";
import { useState } from "react";
import { IPopup } from "../components/Popup/Popup";

type fetching = [() => Promise<void>, boolean, string, number];

export default function useFetching(
  callback: (...args: any[]) => any,
  popupInfo: IPopup | null = null,
  setPopupInfo: React.Dispatch<React.SetStateAction<IPopup>> | null = null
): fetching {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<number>(0);

  const fetching = async () => {
    try {
      setIsLoading(true);
      await callback();
      setErrorStatus(0);
      setError("");
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      const error = e as AxiosError;
      const status = error.response?.status || 0;
      const message = (error.response?.data as string) || "Сервер не отвечает!";

      if (popupInfo && setPopupInfo) {
        setPopupInfo({ ...popupInfo, isVisible: true, body: message });
      }
      setErrorStatus(status);
      setError(message);
    }
  };
  return [fetching, isLoading, error, errorStatus];
}
