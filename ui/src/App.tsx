import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { checkAuth } from "./store/reducers/auth/authActionCreator";
import { Header } from "./models/header/Header";
import { privateRoutes, publicRoutes } from "./routes/routes";
import { Loader } from "./components/Loader/Loader";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { auth, role, error, isLoading, statusError } = useAppSelector(
    (state) => state.auth
  );
  console.log(auth, role, isLoading, error, statusError);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  const route = auth ? privateRoutes : publicRoutes;
  const routes = useRoutes(route);

  return (
    <div className="container">
      {isLoading && <Loader />}
      <Header />
      <div className="workplace">{routes}</div>
    </div>
  );
};
