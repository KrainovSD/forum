import {
  createTopic,
  deleteTopic,
  getTopicByParentID,
  updateTopic,
  updateTopicAccess,
} from "./topicActionCreator";
import { ITopicInitialState, ITopicParentInfo, ItopicType } from "./topicTypes";
import { createSlice } from "@reduxjs/toolkit";
import { IActionError } from "../../../store/types";
import {
  fulfilledAction,
  pendingAction,
  rejectedAction,
} from "../../../store/helpers/typeActions";

const initialState: ITopicInitialState = {
  isLoading: false,
  error: "",
  response: "",
  updated: false,
  statusError: 0,
  parentInfo: null,
  topics: [],
};

export const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTopicByParentID.fulfilled, (state, action) => {
        const payload = action.payload as {
          topics: ItopicType[];
          parentInfo: ITopicParentInfo | null;
        };
        state.topics = payload.topics;
        state.parentInfo = payload.parentInfo;
        state.error = "";
        state.statusError = 0;
        state.isLoading = false;
      })
      .addCase(getTopicByParentID.pending, (state) => {
        state.topics = [];
        state.parentInfo = null;
        state.error = "";
        state.statusError = 0;
        state.isLoading = true;
        state.updated = false;
        state.response = "";
      })
      .addCase(getTopicByParentID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.isLoading = false;
      })
      .addCase(updateTopic.fulfilled, fulfilledAction)
      .addCase(updateTopic.pending, pendingAction)
      .addCase(updateTopic.rejected, rejectedAction)
      .addCase(updateTopicAccess.fulfilled, fulfilledAction)
      .addCase(updateTopicAccess.pending, pendingAction)
      .addCase(updateTopicAccess.rejected, rejectedAction)
      .addCase(createTopic.fulfilled, fulfilledAction)
      .addCase(createTopic.pending, pendingAction)
      .addCase(createTopic.rejected, rejectedAction)
      .addCase(deleteTopic.fulfilled, fulfilledAction)
      .addCase(deleteTopic.pending, pendingAction)
      .addCase(deleteTopic.rejected, rejectedAction);
  },
});

export default topicSlice.reducer;
