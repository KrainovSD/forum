import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { checkAuth } from "./store/reducers/user/userActionCreator";
import { Header } from "./models/header/Header";
import { routes } from "./routes/routes";
import { Loader } from "./components/Loader/Loader";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { auth, role, error, isLoading, statusError } = useAppSelector(
    (state) => state.user
  );
  console.log(auth, role, error, isLoading, statusError);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  const publicRoutes = useRoutes(routes);
  return (
    <div className="container">
      {isLoading && <Loader />}
      <Header />
      <div className="workplace">{publicRoutes}</div>
    </div>
  );
};
