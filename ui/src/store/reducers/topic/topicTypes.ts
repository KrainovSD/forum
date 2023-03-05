export interface ITopicInitialState {
  topics: ItopicType[];
  parentInfo: ITopicParentInfo | null;
  isLoading: boolean;
  error: string;
  statusError: number;
}

export interface ITopicParentInfo {
  id: number;
  title: string;
  accessPost: boolean;
}

export interface ItopicType {
  id: number;
  title: string;
  subTitleList: IsubTitleListType[];
  accessPost: boolean;
  countComment: number;
  lastComment: ITopicLastCommentType | null;
}

export interface ITopicLastCommentType {
  userID: number;
  avatar: string;
  nickName: string;
  postTitle: string;
  postID: number;
  date: string;
}
interface IsubTitleListType {
  id: number;
  title: string;
}
