import { PayloadAction } from "@reduxjs/toolkit";
import { IActionError } from "store/types";

interface ICommonState {
  isLoading: boolean;
  response: string;
  updated: boolean;
  statusError: number;
}

export const fulfilledAction = (
  state: ICommonState,
  action: { payload: string }
) => {
  state.isLoading = false;
  state.response = action.payload;
  state.updated = true;
};
export const pendingAction = (state: ICommonState) => {
  state.response = "";
  state.isLoading = true;
  state.statusError = 0;
  state.updated = false;
};
export const rejectedAction = (
  state: ICommonState,
  action: PayloadAction<unknown>
) => {
  const payload = action.payload as IActionError;
  state.isLoading = false;
  state.statusError = payload.status;
  state.response = payload.message;
};
