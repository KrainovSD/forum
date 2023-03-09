export interface postInitialState {
  posts: IPostsTypes[];
  currentPost: IPostTypes | null;
  maxPage: number;
  isLoading: boolean;
  isSmallLoading: boolean;
  error: string;
  statusError: number;
}

export interface IPostsTypes {
  id: string;
  title: string;
  fixed: boolean;
  closed: boolean;
  verified: boolean;
  authorID: string;
  authorNickName: string;
  date: string;
  countComment: string;
  viewCount: string;
  lastComment: PostLastCommentType | null;
}

export interface IPostTypes {
  id: string;
  title: string;
  fixed: boolean;
  closed: boolean;
  verified: boolean;
  authorID: string;
  authorNickName: string;
  authorAvatar: string | null;
  topicID: string;
  topicTitle: string;
  date: string;
}

export interface PostLastCommentType {
  userID: number;
  avatar: string;
  nickName: string;
  date: string;
  commentID: number;
}
