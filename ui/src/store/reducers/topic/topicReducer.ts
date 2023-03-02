import { getTopicByID } from "./topicActionCreator";
import { TopicInitialState, topicType } from "./topicTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TopicInitialState = {
  isLoading: false,
  error: "",
  statusError: 0,
  parentID: null,
  parentTitle: null,
  topics: [],
};

export const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTopicByID.fulfilled, (state, action) => {
        const payload = action.payload as {
          topic: topicType[];
          parentID: number | null;
          parentTitle: string | null;
        };
        state.topics = payload.topic;
        state.error = "";
        state.statusError = 0;
        state.parentID = payload.parentID;
        state.parentTitle = payload.parentTitle;
        state.isLoading = false;
      })
      .addCase(getTopicByID.pending, (state) => {
        state.topics = [];
        state.error = "";
        state.statusError = 0;
        state.isLoading = true;
      })
      .addCase(getTopicByID.rejected, (state, action) => {
        const payload = action.payload as {
          message: string;
          statusError: number;
        };

        state.error = payload.message;
        state.statusError = payload.statusError;
        state.parentID = null;
        state.parentTitle = null;
        state.isLoading = false;
      });
  },
});

export default topicSlice.reducer;
