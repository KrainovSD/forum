export interface postInitialState {
  posts: IPostsTypes[];
  currentPost: IPostTypes | null;
  maxPage: number;
  isLoading: boolean;
  error: string;
  statusError: number;
}

export interface IPostsTypes {
  id: number;
  title: string;
  fixed: boolean;
  closed: boolean;
  verified: boolean;
  authorID: number;
  authorNickName: string;
  date: string;
  countComment: number;
  viewCount: number;
  lastComment: PostLastCommentType;
}

export interface IPostTypes {
  id: number;
  title: string;
  fixed: boolean;
  closed: boolean;
  verified: boolean;
  authorID: number;
  authorNickName: string;
  authorAvatar: string | null;
  topicID: number;
  topicTitle: string;
  date: string;
}

export interface PostLastCommentType {
  userID: number;
  avatar: boolean;
  nickName: string;
  date: string;
  commentID: number;
}
