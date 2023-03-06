import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { checkAuth } from "./store/reducers/auth/authActionCreator";
import { Header } from "./models/header/Header";
import { privateRoutes, publicRoutes } from "./routes/routes";
import { Loader } from "./components/Loader/Loader";
import { getMyUserInfo } from "./store/reducers/user/userActionCreator";
import { userSlice } from "./store/reducers/user/userReducer";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { auth, isLoading: isLoadingAuth } = useAppSelector(
    (state) => state.auth
  );
  const { isLoading: isLoadingUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  useEffect(() => {
    if (!auth) dispatch(userSlice.actions.clearUserInfo());
    else dispatch(getMyUserInfo());
  }, [auth]);

  const route = auth ? privateRoutes : publicRoutes;
  const routes = useRoutes(route);

  return (
    <div className="container">
      {(isLoadingAuth || isLoadingUser) && <Loader />}
      <Header />
      <div className="workplace">{routes}</div>
    </div>
  );
};
