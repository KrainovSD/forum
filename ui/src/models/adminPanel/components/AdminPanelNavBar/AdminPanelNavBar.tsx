import {
  getAdminPanelCommentsLink,
  getAdminPanelPostsLink,
} from "../../../../helpers/getLinks";
import { NavLink, useLocation } from "react-router-dom";
import "./AdminPanelNavBar.scss";

export const AdminPanelNavBar: React.FC = () => {
  const locate = useLocation();
  const option = locate.pathname.split("/")[2];

  return (
    <div className="admin-panel-nav-bar__content-list">
      <div className="admin-panel-nav-bar__content-header">Форум</div>
      <NavLink
        to={getAdminPanelPostsLink()}
        className={`admin-panel-nav-bar__content-item ${
          option === "posts" ? "_active" : ""
        }`}
      >
        Темы
      </NavLink>
      <NavLink
        to={getAdminPanelCommentsLink()}
        className={`admin-panel-nav-bar__content-item ${
          option === "comments" ? "_active" : ""
        }`}
      >
        Комментарии
      </NavLink>
    </div>
  );
};
