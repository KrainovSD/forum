import { createSlice } from "@reduxjs/toolkit";
import { getMessageByUserID } from "./messageActionCreator";
import { IMessageInitialState } from "./messageTypes";
import { IActionError } from "../../types/index";

const initialState: IMessageInitialState = {
  messages: [],
  isLoading: false,
  isSmallLoading: false,
  error: "",
  statusError: 0,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessageByUserID.fulfilled, (state, action) => {})
      .addCase(getMessageByUserID.pending, (state) => {
        state.isSmallLoading = true;
        state.error = "";
        state.statusError = 0;
      })
      .addCase(getMessageByUserID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.isSmallLoading = false;
      });
  },
});

export default messageSlice.reducer;
