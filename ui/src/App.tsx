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
  const { isLoading: isLoadingTopic } = useAppSelector((state) => state.topic);
  const { isLoading: isLoadingPost } = useAppSelector((state) => state.post);
  const { isLoading: isLoadingLike } = useAppSelector((state) => state.like);
  const { isLoading: isLoadingComment } = useAppSelector(
    (state) => state.comment
  );
  const { isLoading: isLoadingMessage } = useAppSelector(
    (state) => state.message
  );

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
      {(isLoadingAuth ||
        isLoadingUser ||
        isLoadingTopic ||
        isLoadingPost ||
        isLoadingLike ||
        isLoadingComment ||
        isLoadingMessage) && <Loader />}
      <Header />
      <div className="workplace">{routes}</div>
    </div>
  );
};
