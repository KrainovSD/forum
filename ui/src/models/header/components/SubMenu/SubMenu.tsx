import out from "../../../../assets/media/out.png";
import setting from "../../../../assets/media/setting.png";
import { CSSTransition } from "react-transition-group";
import "./SubMenu.scss";
import { useAppDispatch } from "../../../../hooks/redux";
import useFetching from "../../../../hooks/useFetching";
import { authSlice } from "../../../../store/reducers/auth/authReducer";
import { axiosInstanceToken } from "../../../../helpers/axiosInstanceToken";
import { useEffect } from "react";

interface SubMenuProps {
  isVisible: boolean;
  setLoading: (v: boolean) => void;
}

export const SubMenu: React.FC<SubMenuProps> = ({ isVisible, setLoading }) => {
  const dispatch = useAppDispatch();
  const { fetching: sendLogout, isLoading } = useFetching(async () => {
    await axiosInstanceToken.post("/api/auth/logout");
    dispatch(authSlice.actions.logout());
  });

  const logout = () => {
    sendLogout();
  };
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="userBarAnim"
      unmountOnExit
    >
      <div className="userBar__subMenu">
        <p className="userBar__subMenuHeader">НАСТРОЙКИ</p>
        <div className="userBar__subMenuItem">
          <img src={setting} alt="" />
          <p>Настройки профиля</p>
        </div>
        <div className="userBar__subMenuItem" onClick={logout}>
          <img src={out} alt="" />
          <p>Выйти</p>
        </div>
      </div>
    </CSSTransition>
  );
};
