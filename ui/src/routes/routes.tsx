import { Navigate } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ConfirmPage } from "../pages/ConfirmPage";
import { ProfilePage } from "../pages/ProfilePage";
import { TopicPage } from "../pages/TopicPage";
import { PostPage } from "../pages/PostPage";

export const publicRoutes = [
  { path: "/", element: <MainPage /> },
  { path: "/topic/:id", element: <TopicPage /> },
  { path: "/post/:id", element: <PostPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/confirm/:key", element: <ConfirmPage /> },
  { path: "/profile/:id", element: <ProfilePage /> },
  { path: "*", element: <Navigate to={"/"} replace /> },
];

export const privateRoutes = [
  { path: "/", element: <MainPage /> },
  { path: "/topic/:id", element: <TopicPage /> },
  { path: "/post/:id", element: <PostPage /> },
  { path: "/confirm/:key", element: <ConfirmPage /> },
  { path: "/profile/:id", element: <ProfilePage /> },
  { path: "*", element: <Navigate to={"/"} replace /> },
];
