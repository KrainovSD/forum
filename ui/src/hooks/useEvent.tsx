import { useEffect } from "react";

export const useEvent = (
  event: string,
  hanlder: (this: HTMLElement, ev: Event) => void
) => {
  useEffect(() => {
    window.addEventListener(event, hanlder);

    return () => {
      window.removeEventListener(event, hanlder);
    };
  }, []);
};
