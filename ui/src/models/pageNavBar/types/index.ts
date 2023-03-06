import { useSearchParams } from "react-router-dom";
type SetURLSearchParams = ReturnType<typeof useSearchParams>[1];
export type typeSearch = [ISearch, SetURLSearchParams];
interface ISearch {
  [k: string]: string;
  page: string;
  filter: string;
}
