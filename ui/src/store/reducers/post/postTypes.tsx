export interface IPostInitialState {
  posts: IPostsTypes[];
  currentPost: IPostTypes | null;
  lastPosts: ILastPost[];
  maxPage: number;
  response: string;
  updated: boolean;
  isLoading: boolean;
  isSmallLoading: boolean;
  error: string;
  statusError: number;
}

export interface ILastPost {
  postID: string;
  postTitle: string;
  postDate: string;
  authorID: string;
  authorAvatar: string;
  authorNickName: string;
  topicID: string;
  topicTitle: string;
  countComment: string;
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
  viewed: boolean;
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
  userID: string;
  avatar: string;
  nickName: string;
  date: string;
  commentID: string;
}

export interface IUpdatePost {
  postID: string;
  title: string;
  topicID: string;
}

export interface IAdminUpdatePost {
  postID: string;
  value: boolean;
}

export interface ICreatePost {
  body: string;
  topicID: string;
  title: string;
}

export interface IGetAllPosts {
  page: string;
  filter: string;
}

export interface IGetUserPosts {
  page: string;
  filter: string;
  userID: string;
}
