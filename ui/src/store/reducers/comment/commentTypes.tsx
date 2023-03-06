export interface ICommentInitialState {
  comments: IComment[];
  maxPage: number;
  isLoading: boolean;
  error: string;
  statusError: number;
}
export interface IComment {
  id: string;
  body: string;
  main: boolean;
  authorNickName: string;
  authorID: string;
  authorAvatar: string;
  authorRole: string;
  authorReputation: string;
  authorCountComment: string;
  date: string;
  updated: boolean;
  dateUpdate: string | null;
  authorUpdateNickName: string | null;
  authorUpdateID: string | null;
  verified: boolean;
  fixed: boolean;
  likes: string[];
}

export interface IReqGetCommentByPost {
  page: string;
  id: string;
}
