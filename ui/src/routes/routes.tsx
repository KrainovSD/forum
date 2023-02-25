import { Navigate } from "react-router-dom";
import { Main } from "../pages/Main";

export const routes = [
  { path: "/", element: <Main /> },
  { path: "*", element: <Navigate to={"/"} replace /> },
];
