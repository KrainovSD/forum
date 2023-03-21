import out from "../../../../assets/media/out.png";
import setting from "../../../../assets/media/setting.png";
import moder from "../../../../assets/media/moder.png";
import { CSSTransition } from "react-transition-group";
import "./SubMenu.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import useFetching from "../../../../hooks/useFetching";
import { authSlice } from "../../../../store/reducers/auth/authReducer";
import { axiosInstanceToken } from "../../../../helpers/axiosInstanceToken";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getSettingLink } from "../../../../helpers/getLinks";

interface SubMenuProps {
  isVisible: boolean;
  setLoading: (v: boolean) => void;
  closeMenu: () => void;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  isVisible,
  setLoading,
  closeMenu,
}) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.user);

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
        <NavLink
          to={getSettingLink("review")}
          className="userBar__subMenuItem"
          onClick={closeMenu}
        >
          <img src={setting} alt="" />
          <p>Настройки профиля</p>
        </NavLink>
        {userInfo &&
          (userInfo.role === "admin" || userInfo.role === "moder") && (
            <NavLink
              to="/admin-panel"
              className="userBar__subMenuItem"
              onClick={closeMenu}
            >
              <img src={moder} alt="" />
              <p>Панель администратора</p>
            </NavLink>
          )}
        <div className="userBar__subMenuItem" onClick={logout}>
          <img src={out} alt="" />
          <p>Выйти</p>
        </div>
      </div>
    </CSSTransition>
  );
};
