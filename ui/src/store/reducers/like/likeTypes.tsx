export interface ILikeInitialState {
  likes: ILike[] | null;
  isLoading: boolean;
  updated: boolean;
  error: string;
  statusError: number;
}

export interface ILike {
  id: string;
  fromID: string;
  fromAvatar: string;
  fromNickName: string;
  to: string;
  commentID: string;
  date: string;
}
