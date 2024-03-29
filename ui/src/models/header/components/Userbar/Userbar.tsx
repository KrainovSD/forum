import arrowDown from "../../../../assets/media/arrow-down.png";
import plus from "../../../../assets/media/plus.png";
import user from "../../../../assets/media/user.png";
import "./Userbar.scss";
import { useState } from "react";
import { SubMenu } from "../SubMenu/SubMenu";
import { useEvent } from "../../../../hooks/useEvent";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/redux";
import { Loader } from "../../../../components/Loader/Loader";
import { getCreatePostLink, getUserLink } from "../../../../helpers/getLinks";

export const Userbar: React.FC = () => {
  const [isSubMenuVisible, setIsSubMenuVisible] = useState<boolean>(false);

  function offSubMenuVisible(this: HTMLElement, ev: Event) {
    const allowClasses: string[] = [
      "userBar__nickName",
      "userBar__subMenuItem",
      "userBar__subMenu",
    ];

    const target: Element = ev.target as Element;
    const targetClass: string | undefined = target?.classList?.[0];
    if (allowClasses.includes(targetClass)) return;

    const parentTarget: Element = (ev.target as Element)?.parentNode as Element;
    const parentTargetClass: string | undefined = parentTarget?.classList?.[0];
    if (allowClasses.includes(parentTargetClass)) return;

    setIsSubMenuVisible(false);
  }
  const toggleSubMenuVisible = () => {
    const visible: boolean = isSubMenuVisible ? false : true;
    setIsSubMenuVisible(visible);
  };
  useEvent("click", offSubMenuVisible);
  const { auth } = useAppSelector((state) => state.auth);
  const { userInfo } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

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
        {userInfo && (
          <NavLink
            to={getUserLink(userInfo.id)}
            className="userBar__img-container"
            data-tooltip="Профиль"
          >
            <img src={user} alt="" className="userBar__img" />
          </NavLink>
        )}
        <div className="userBar__nickNameWrapper">
          <div className="userBar__nickName" onClick={toggleSubMenuVisible}>
            <p>{userInfo?.nickName}</p>
            <img src={arrowDown} alt="" className="userBar__arrow" />
          </div>
          <SubMenu
            isVisible={isSubMenuVisible}
            setLoading={(v: boolean) => setIsLoading(v)}
            closeMenu={() => {
              setIsSubMenuVisible(false);
            }}
          />
        </div>
        <NavLink
          to={getCreatePostLink()}
          className="userBar__newContent"
          data-tooltip="Создать новый контент"
        >
          <img src={plus} alt="" className="userBar__plus" />
          <p>Создать</p>
        </NavLink>
        <div
          className="userBar__notice"
          data-tooltip="Уведомления (В разработке)"
        >
          <div className="userBar__noticeImg"></div>
        </div>
        <NavLink
          to={`/message`}
          className="userBar__chat"
          data-tooltip-left="Личные сообщения"
        >
          <div className="userBar__chatImg"></div>
        </NavLink>
      </div>
    </div>
  );
};
