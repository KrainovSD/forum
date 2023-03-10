export interface IMessageInitialState {
  messages: IMessage[];
  isLoading: boolean;
  isSmallLoading: boolean;
  error: string;
  statusError: number;
}

export interface IMessage {
  id: string;
}
