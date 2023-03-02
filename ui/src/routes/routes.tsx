import { Navigate } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ConfirmPage } from "../pages/ConfirmPage";
import { ProfilePublicPage } from "../pages/ProfilePublicPage";
import { ProfileOwnPage } from "../pages/ProfileOwnPage";
import { TopicPage } from "../pages/TopicPage";

export const publicRoutes = [
  { path: "/", element: <MainPage /> },
  { path: "/topic/:id", element: <TopicPage /> },

  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/confirm/:key", element: <ConfirmPage /> },
  { path: "/profile/:id", element: <ProfilePublicPage /> },
  { path: "*", element: <Navigate to={"/"} replace /> },
];

export const privateRoutes = [
  { path: "/", element: <MainPage /> },
  { path: "/topic/:id", element: <TopicPage /> },
  { path: "/confirm/:key", element: <ConfirmPage /> },
  { path: "/profile/:id", element: <ProfilePublicPage /> },
  { path: "/profile/my", element: <ProfileOwnPage /> },
  { path: "*", element: <Navigate to={"/"} replace /> },
];
