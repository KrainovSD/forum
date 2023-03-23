import { useState, useRef, useEffect, MutableRefObject } from "react";

export const useIntersect = (
  viewport: HTMLDivElement | null,
  node: HTMLDivElement | null
) => {
  const [observed, setObserved] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    console.log("tap2");
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        setObserved(entries[0].isIntersecting);
      },
      {
        root: viewport,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );
    const { current: currentObserver } = observer;
    if (node) currentObserver.observe(node);
    return () => currentObserver.disconnect();
  }, [node]);

  return { observed };
};
