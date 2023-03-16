import { useEffect, useRef } from "react";

export const useEffectOnlyUpdate = (
  callback: () => void,
  dependencies: any[]
) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) isInitialMount.current = false;
    else callback();
  }, [...dependencies]);
};
