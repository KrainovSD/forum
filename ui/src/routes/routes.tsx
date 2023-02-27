import { Navigate } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ConfirmPage } from "../pages/ConfirmPage";

export const publicRoutes = [
  { path: "/", element: <MainPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/confirm/:key", element: <ConfirmPage /> },
  { path: "*", element: <Navigate to={"/"} replace /> },
];

export const privateRoutes = [
  { path: "/", element: <MainPage /> },
  { path: "/confirm/:key", element: <ConfirmPage /> },
  { path: "*", element: <Navigate to={"/"} replace /> },
];
