import topicSlice from "./reducers/topic/topicReducer";
import authSlice from "./reducers/auth/authReducer";
import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./reducers/post/postReducer";
import commentSlice from "./reducers/comment/commentReducer";
import userSlice from "./reducers/user/userReducer";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    topic: topicSlice,
    post: postSlice,
    comment: commentSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
