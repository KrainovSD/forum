import { useEffect } from "react";

export type THandlerEvent = (this: HTMLElement, ev: Event) => void;

export const useEvent = (event: string, hanlder: THandlerEvent) => {
  useEffect(() => {
    window.addEventListener(event, hanlder);

    return () => {
      window.removeEventListener(event, hanlder);
    };
  }, []);
};
