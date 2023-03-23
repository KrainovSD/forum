import { createSlice } from "@reduxjs/toolkit";
import {
  createMessage,
  deleteMessage,
  deleteSession,
  getMessage,
  getSession,
  updateMessage,
} from "./messageActionCreator";
import { IMessageInitialState } from "./messageTypes";
import { IActionError } from "../../types/index";
import {
  fulfilledAction,
  pendingAction,
  rejectedAction,
} from "../../../store/helpers/typeActions";

const initialState: IMessageInitialState = {
  messages: [],
  sessions: [],
  maxPage: 1,
  isLoading: false,
  isSmallLoading: false,
  response: "",
  updated: false,
  error: "",
  statusError: 0,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessage.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.maxPage = action.payload.maxPage;
        state.isSmallLoading = false;
      })
      .addCase(getMessage.pending, (state) => {
        state.isSmallLoading = true;
        state.error = "";
        state.statusError = 0;
      })
      .addCase(getMessage.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.isSmallLoading = false;
        state.messages = [];
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.isLoading = false;
      })
      .addCase(getSession.pending, (state) => {
        state.isLoading = true;
        state.error = "";
        state.statusError = 0;
      })
      .addCase(getSession.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.isLoading = false;
        state.sessions = [];
      })
      .addCase(createMessage.fulfilled, fulfilledAction)
      .addCase(createMessage.pending, pendingAction)
      .addCase(createMessage.rejected, rejectedAction)
      .addCase(updateMessage.fulfilled, fulfilledAction)
      .addCase(updateMessage.pending, pendingAction)
      .addCase(updateMessage.rejected, rejectedAction)
      .addCase(deleteMessage.fulfilled, fulfilledAction)
      .addCase(deleteMessage.pending, pendingAction)
      .addCase(deleteMessage.rejected, rejectedAction)
      .addCase(deleteSession.fulfilled, fulfilledAction)
      .addCase(deleteSession.pending, pendingAction)
      .addCase(deleteSession.rejected, rejectedAction);
  },
});

export default messageSlice.reducer;
