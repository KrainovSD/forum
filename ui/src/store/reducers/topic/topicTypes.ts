export interface ITopicInitialState {
  topics: ItopicType[];
  parentInfo: ITopicParentInfo | null;
  isLoading: boolean;
  updated: boolean;
  response: string;
  error: string;
  statusError: number;
}

export interface ITopicParentInfo {
  id: string;
  title: string;
  accessPost: boolean;
}

export interface ItopicType {
  id: string;
  title: string;
  subTitleList: IsubTitleListType[];
  accessPost: boolean;
  countComment: string;
  lastComment: ITopicLastCommentType | null;
}

export interface ITopicLastCommentType {
  userID: string;
  avatar: string;
  nickName: string;
  postTitle: string;
  postID: string;
  date: string;
}
interface IsubTitleListType {
  id: string;
  title: string;
}

export interface IUpdateTopic {
  title: string;
  access: boolean;
  parentID: string | null;
  topicID: string;
}
export interface IUpdateAccessTopic {
  topicID: string;
  value: boolean;
}
export interface IAddTopic {
  title: string;
  access: boolean;
  parentID: string | null;
}
