import { useSearchParams } from "react-router-dom";

type SetURLSearchParams = ReturnType<typeof useSearchParams>[1];
type typeUseCustomSearchParams = [{ [k: string]: string }, SetURLSearchParams];

export const useCustomSearchParams = (): typeUseCustomSearchParams => {
  const [search, setSearch] = useSearchParams();
  const searchAsObject = Object.fromEntries(new URLSearchParams(search));

  return [searchAsObject, setSearch];
};
