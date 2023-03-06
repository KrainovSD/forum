export interface IUserInitialState {
  userInfo: IUserInfo | null;
  selectedUserInfo: ISelectedUserInfo | null;
  isLoading: boolean;
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
  countComment: number;
  reputation: number;
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
