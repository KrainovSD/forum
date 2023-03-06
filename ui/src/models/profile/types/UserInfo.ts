export interface IUserInfoProp {
  id: number;
  nickName: string;
  role: string;
  avatar: string;
  backImg: string;
  dateRegistration: string;
  lastLogin: string;
  userName?: string;
  email?: string;
  resetPasswordLast?: string;
  confirmEmailLast?: string;
  countComment: number;
  reputation: number;
}
