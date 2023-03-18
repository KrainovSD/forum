import { Navigate } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ConfirmPage } from "../pages/ConfirmPage";
import { ProfilePage } from "../pages/ProfilePage";
import { TopicPage } from "../pages/TopicPage";
import { PostPage } from "../pages/PostPage";
import { AddPostPage } from "../pages/AddPostPage";
import { UpdatePostPage } from "../pages/UpdatePostPage";
import { AddTopicPage } from "../pages/AddTopicPage";
import { UpdateTopicPage } from "../pages/UpdateTopicPage";
import { AdminPanelPage } from "../pages/AdminPanelPage";
import { AdminPanelCommentList } from "../models/adminPanel/components/AdminPanelCommentsList/AdminPanelCommentList";
import { AdminPanelPostList } from "../models/adminPanel/components/AdminPanelPostList/AdminPanelPostList";

const commonRoutes = [
  { path: "/", element: <MainPage /> },
  { path: "/profile/:id", element: <ProfilePage /> },
  { path: "/confirm/:key", element: <ConfirmPage /> },

  { path: "/topic/:id", element: <TopicPage /> },
  { path: "/post/:id", element: <PostPage /> },

  { path: "*", element: <Navigate to={"/"} replace /> },
];
const privateCommonRoutes = [
  { path: "/create/post?/:topicID", element: <AddPostPage /> },
  { path: "/update/post/:postID", element: <UpdatePostPage /> },
];

export const publicRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    path: "/admin-panel",
    element: <AdminPanelPage />,
    children: [{ path: "comments", element: <AdminPanelCommentList /> }],
  },

  ...commonRoutes,
];

export const privateRoutes = [
  {
    path: "/admin-panel",
    element: <AdminPanelPage />,
    children: [{ path: "comments", element: <AdminPanelCommentList /> }],
  },
  ...privateCommonRoutes,
  ...commonRoutes,
];

export const moderRoutes = [
  {
    path: "/admin-panel",
    element: <AdminPanelPage />,
    children: [{ path: "comments", element: <AdminPanelCommentList /> }],
  },
  ...privateCommonRoutes,
  ...commonRoutes,
];

export const adminRoutes = [
  { path: "/create/topic?/:topicID", element: <AddTopicPage /> },
  { path: "/update/topic/:topicID", element: <UpdateTopicPage /> },

  {
    path: "/admin-panel",
    element: <AdminPanelPage />,
    children: [
      { path: "comments", element: <AdminPanelCommentList /> },
      { path: "posts", element: <AdminPanelPostList /> },
    ],
  },
  ...privateCommonRoutes,
  ...commonRoutes,
];
