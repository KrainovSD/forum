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
import { UserInfo } from "../models/profile/components/UserInfo/UserInfo";
import { UserContent } from "../models/profile/components/UserContent/UserContent";
import { UserCommentList } from "../models/profile/components/UserCommentList/UserCommentList";
import { UserPostList } from "../models/profile/components/UserPostList/UserPostList";
import { SettingPage } from "../pages/SettingPage";
import { SettingReview } from "../models/setting/components/SettingReview/SettingReview";
import { SettingNickName } from "../models/setting/components/SettingNickName/SettingNickName";
import { SettingUserName } from "../models/setting/components/SettingUserName/SettingUserName";
import { SettingPassword } from "../models/setting/components/SettingPassword/SettingPassword";
import { SettingEmail } from "../models/setting/components/SettingEmail/SettingEmail";
import { SettingForgotPassword } from "../models/setting/components/SettingForgotPassword/SettingForgotPassword";

const commonRoutes = [
  { path: "/", element: <MainPage /> },
  {
    path: "/profile",
    element: <ProfilePage />,
    children: [
      { path: "info/:id", element: <UserInfo /> },
      {
        path: "content",
        element: <UserContent />,
        children: [
          { path: "comments/:id", element: <UserCommentList /> },
          { path: "posts/:id", element: <UserPostList /> },
        ],
      },
    ],
  },
  { path: "/confirm/:key", element: <ConfirmPage /> },
  { path: "/password/:key", element: <SettingPassword /> },
  { path: "/email/:key", element: <SettingEmail /> },

  {
    path: "/setting",
    element: <SettingPage />,
    children: [
      { path: "review", element: <SettingReview /> },
      { path: "nick-name", element: <SettingNickName /> },
      { path: "user-name", element: <SettingUserName /> },
    ],
  },

  { path: "/topic/:id", element: <TopicPage /> },
  { path: "/post/:id", element: <PostPage /> },

  { path: "*", element: <Navigate to={"/"} replace /> },
];
const onlyPublicRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot", element: <SettingForgotPassword /> },
];
const privateCommonRoutes = [
  { path: "/create/post?/:topicID", element: <AddPostPage /> },
  { path: "/update/post/:postID", element: <UpdatePostPage /> },
];
const moderCommonRoutes = [
  {
    path: "/admin-panel",
    element: <AdminPanelPage />,
    children: [
      { path: "comments", element: <AdminPanelCommentList /> },
      { path: "posts", element: <AdminPanelPostList /> },
    ],
  },
];
const onlyAdminRoutes = [
  { path: "/create/topic?/:topicID", element: <AddTopicPage /> },
  { path: "/update/topic/:topicID", element: <UpdateTopicPage /> },
];

export const publicRoutes = [...onlyPublicRoutes, ...commonRoutes];
export const privateRoutes = [...privateCommonRoutes, ...commonRoutes];
export const moderRoutes = [
  ...moderCommonRoutes,
  ...privateCommonRoutes,
  ...commonRoutes,
];
export const adminRoutes = [
  ...onlyAdminRoutes,
  ...moderCommonRoutes,
  ...privateCommonRoutes,
  ...commonRoutes,
];
