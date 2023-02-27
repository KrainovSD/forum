export interface checkAuthData {
  token: string;
  role: string;
}
export interface checkAuthError {
  status: number;
  message: string;
}
export interface loginData {
  message: string;
  token: string;
  role: string;
}

export interface authState {
  auth: boolean;
  role: string;
  isLoading: boolean;
  statusError: number;
  error: string;
}
