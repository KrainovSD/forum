import arrowDown from "../../../../assets/media/arrow-down.png";
import plus from "../../../../assets/media/plus.png";
import user from "../../../../assets/media/user.png";
import "./Userbar.scss";
import { useState, useEffect, useMemo } from "react";
import { SubMenu } from "../SubMenu/SubMenu";
import { useEvent } from "../../../../hooks/useEvent";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/redux";
import useFetching from "../../../../hooks/useFetching";
import { axiosInstanceToken } from "../../../../helpers/axiosInstanceToken";
import { useAppDispatch } from "../../../../hooks/redux";
import { authSlice } from "../../../../store/reducers/auth/authReducer";
import { Loader } from "../../../../components/Loader/Loader";

export const Userbar: React.FC = () => {
  const [isSubMenuVisible, setIsSubMenuVisible] = useState<boolean>(false);

  function offSubMenuVisible(this: HTMLElement, ev: Event) {
    const allowClasses: string[] = [
      "userBar__nickName",
      "userBar__subMenuItem",
      "userBar__subMenu",
    ];

    const target: Element = ev.target as Element;
    const targetClass: string | undefined = target.classList?.[0];
    if (allowClasses.includes(targetClass)) return;

    const parentTarget: Element = (ev.target as Element)?.parentNode as Element;
    const parentTargetClass: string | undefined = parentTarget.classList?.[0];
    if (allowClasses.includes(parentTargetClass)) return;

    setIsSubMenuVisible(false);
  }
  const toggleSubMenuVisible = () => {
    const visible: boolean = isSubMenuVisible ? false : true;
    setIsSubMenuVisible(visible);
  };
  useEvent("click", offSubMenuVisible);
  const { auth } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const [sendLogout, isLoading] = useFetching(async () => {
    await axiosInstanceToken.post("/api/auth/logout");
    dispatch(authSlice.actions.logout());
  });

  const logout = () => {
    sendLogout();
  };

  if (!auth)
    return (
      <div className="userBar">
        <div className="userBar__wrapper">
          <NavLink to="/login">
            <div className="userBar__login">Уже зарегистрированы? Войти</div>
          </NavLink>
          <NavLink to="/register">
            <div className="userBar__register">Регистрация</div>
          </NavLink>
        </div>
      </div>
    );

  return (
    <div className="userBar">
      {isLoading && <Loader />}
      <div className="userBar__wrapper">
        <div className="userBar__img-container" data-tooltip="Профиль">
          <img src={user} alt="" className="userBar__img" />
        </div>
        <div className="userBar__nickNameWrapper">
          <div className="userBar__nickName" onClick={toggleSubMenuVisible}>
            <p>Serega_Krainov48</p>
            <img src={arrowDown} alt="" className="userBar__arrow" />
          </div>
          <SubMenu
            isVisible={isSubMenuVisible}
            logout={() => {
              logout();
            }}
          />
        </div>
        <div
          className="userBar__newContent"
          data-tooltip="Создать новый контент"
        >
          <img src={plus} alt="" className="userBar__plus" />
          <p>Создать</p>
        </div>
        <div className="userBar__notice" data-tooltip="Уведомления">
          <div className="userBar__noticeImg"></div>
        </div>
        <div className="userBar__chat" data-tooltip-left="Личные сообщения">
          <div className="userBar__chatImg"></div>
        </div>
      </div>
    </div>
  );
};
