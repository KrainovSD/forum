import { useSearchParams } from "react-router-dom";

type SetURLSearchParams = ReturnType<typeof useSearchParams>[1];

export type typePostSearch = [ISearchPost, SetURLSearchParams];
interface ISearchPost {
  [k: string]: string;
  page: string;
  filter: string;
}
