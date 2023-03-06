export interface ICheckAuthData {
  token: string;
}
export interface ICheckAuthError {
  status: number;
  message: string;
}

export interface IAuthInitialState {
  auth: boolean;
  isLoading: boolean;
  statusError: number;
  error: string;
}
