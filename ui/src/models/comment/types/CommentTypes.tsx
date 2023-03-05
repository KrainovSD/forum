import { useSearchParams } from "react-router-dom";

type SetURLSearchParams = ReturnType<typeof useSearchParams>[1];

export type ICommentSearch = [IComment, SetURLSearchParams];
interface IComment {
  [k: string]: string;
  page: string;
}
