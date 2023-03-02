export interface TopicInitialState {
  topics: topicType[];
  parentID: null | number;
  parentTitle: null | string;
  isLoading: boolean;
  error: string;
  statusError: number;
}

export interface topicType {
  id: number;
  title: string;
  subTitleList: subTitleListType[];
  accessPost: boolean;
  countComment: number;
  lastComment: lastCommentType | null;
}

interface lastCommentType {
  userID: number;
  avatar: boolean;
  nickName: string;
  postTitle: string;
  postID: number;
  date: string;
}
interface subTitleListType {
  id: number;
  title: string;
}
