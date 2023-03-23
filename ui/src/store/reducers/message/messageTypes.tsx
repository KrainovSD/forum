export interface IMessageInitialState {
  messages: IMessage[];
  sessions: ISession[];
  maxPage: number;
  isLoading: boolean;
  isSmallLoading: boolean;
  updated: boolean;
  response: string;
  error: string;
  statusError: number;
}

export interface IMessage {
  id: string;
  body: string;
  fromID: string;
  fromAvatar: string;
  fromNickName: string;
  date: string;
  updated: boolean;
}

export interface ISession {
  sessionID: string;
  otherUsersNickName: string[];
  otherUsersID: string[];
  otherUsersAvatar: string[];
  countMessage: number;
  unViewedCountMessage: number;
  lastMessage: {
    authorID: string;
    authorAvatar: string;
    authorNickName: string;
    lastDate: string;
    body: string;
  };
}

export interface IGetMessage {
  page: string;
  sessionID: string;
}

export interface ICreateMessage {
  body: string;
  members: string[];
}
export interface IUpdateMessage {
  messageID: string;
  body: string;
}
