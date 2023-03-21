export interface IUserInitialState {
  userInfo: IUserInfo | null;
  selectedUserInfo: ISelectedUserInfo | null;
  userContent: ILastUserContent[];
  isLoading: boolean;
  response: string;
  updated: boolean;
  error: string;
  statusError: number;
}

export interface IUserInfo {
  id: string;
  nickName: string;
  role: string;
  avatar: string;
  backImg: string;
  dateRegistration: string;
  lastLogin: string;
  userName: string;
  email: string;
  resetPasswordLast: string;
  confirmEmailLast: string;
  countComment: string;
  reputation: string;
}

export interface ISelectedUserInfo {
  id: string;
  nickName: string;
  role: string;
  avatar: string;
  backImg: string;
  dateRegistration: string;
  lastLogin: string;
  countComment: string;
  reputation: string;
}

export interface ILastUserContent {
  post: ILastUserContentPost;
  topic: ILastUserContentTopic;
  comment: ILastUserContentComment;
}

interface ILastUserContentPost {
  id: string;
  title: string;
}
interface ILastUserContentTopic {
  id: string;
  title: string;
}
interface ILastUserContentComment {
  id: string;
  body: string;
  main: boolean;
  date: string;
  update: ILastUserContentCommentUpdate;
}
interface ILastUserContentCommentUpdate {
  updated: boolean;
  authorID: string;
  authorNickName: string;
  date: string;
}

export interface IGetUserContent {
  userID: string;
  page: number;
}

export interface IUpdatePassword {
  password: string;
  key: string;
}
export interface IUpdateEmail {
  email: string;
  key: string;
}
