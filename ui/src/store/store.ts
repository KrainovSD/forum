import messageSlice from "./reducers/message/messageReducer";
import topicSlice from "./reducers/topic/topicReducer";
import authSlice from "./reducers/auth/authReducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import postSlice from "./reducers/post/postReducer";
import commentSlice from "./reducers/comment/commentReducer";
import userSlice from "./reducers/user/userReducer";
import likeSlice from "./reducers/like/likeReducer";
import { navContentBarSlice } from "./RTK Query/navContentBar/navContentBarSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    topic: topicSlice,
    post: postSlice,
    comment: commentSlice,
    user: userSlice,
    like: likeSlice,
    message: messageSlice,
    [navContentBarSlice.reducerPath]: navContentBarSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(navContentBarSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
