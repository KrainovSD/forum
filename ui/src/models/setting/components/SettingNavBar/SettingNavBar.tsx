import { getSettingLink } from "../../../../helpers/getLinks";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./SettingNavBar.scss";
import { useEffect } from "react";
export const SettingNavBar: React.FC = () => {
  const navigate = useNavigate();
  const locate = useLocation();
  const allowOption = ["review", "user-name", "nick-name"];
  const option = locate.pathname.split("/")[2];
  useEffect(() => {
    if (!allowOption.includes(option)) navigate(getSettingLink("review"));
  }, [option]);

  return (
    <div className="setting-nav-bar__content-list">
      <NavLink
        to={getSettingLink("review")}
        className={`setting-nav-bar__content-item ${
          option === "review" ? "_active" : ""
        }`}
      >
        Обзор
      </NavLink>
      <NavLink
        to={getSettingLink("nick-name")}
        className={`setting-nav-bar__content-item ${
          option === "nick-name" ? "_active" : ""
        }`}
      >
        Отображаемое имя
      </NavLink>
      <NavLink
        to={getSettingLink("user-name")}
        className={`setting-nav-bar__content-item ${
          option === "user-name" ? "_active" : ""
        }`}
      >
        Имя пользователя
      </NavLink>
    </div>
  );
};
