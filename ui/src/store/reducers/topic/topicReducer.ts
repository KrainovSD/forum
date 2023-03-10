import { getTopicByID } from "./topicActionCreator";
import { ITopicInitialState, ITopicParentInfo, ItopicType } from "./topicTypes";
import { createSlice } from "@reduxjs/toolkit";
import { IActionError } from "../../../store/types";

const initialState: ITopicInitialState = {
  isLoading: false,
  error: "",
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
      .addCase(getTopicByID.fulfilled, (state, action) => {
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
      .addCase(getTopicByID.pending, (state) => {
        state.topics = [];
        state.parentInfo = null;
        state.error = "";
        state.statusError = 0;
        state.isLoading = true;
      })
      .addCase(getTopicByID.rejected, (state, action) => {
        const payload = action.payload as IActionError;
        state.error = payload.message;
        state.statusError = payload.status;
        state.isLoading = false;
      });
  },
});

export default topicSlice.reducer;
