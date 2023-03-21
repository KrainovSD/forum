export interface ICommentInitialState {
  comments: IComment[];
  maxPage: number;
  updated: boolean;
  response: string;
  isLoading: boolean;
  isSmallLoading: boolean;
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
  countLikes: number;
  postID: string;
  postTitle: string;
}

export interface IReqGetCommentByPost {
  page: string;
  id: string;
}

export interface IGetAllComments {
  page: string;
  filter: string;
}

export interface ICreateComment {
  body: string;
  postID: string;
}

export interface IUpdateComment {
  commentID: string;
  body: string;
}

export interface IUpdateCommentVerified {
  commentID: string;
  verified: boolean;
}

export interface IUpdateCommentFixed {
  commentID: string;
  fixed: boolean;
}

export interface IGetCommentByUserID {
  page: string;
  filter?: string;
  userID: string;
}
