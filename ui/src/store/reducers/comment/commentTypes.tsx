export interface ICommentInitialState {
  comments: IComment[];
  maxPage: number;
  isLoading: boolean;
  error: string;
  statusError: number;
}
export interface IComment {
  id: number;
  body: string;
  main: boolean;
  authorNickName: string;
  authorID: number;
  authorAvatar: string;
  date: string;
  updated: boolean;
  dateUpdate: boolean | null;
  authorUpdateNickName: string | null;
  authorUpdateID: number | null;
  authorRole: string;
  verified: boolean;
  fixed: boolean;
  likes: string[];
}

export interface IReqGetCommentByPost {
  page: string;
  id: string;
}
