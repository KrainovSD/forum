import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminPanel.scss";

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const locate = useLocation();
  const option = locate.pathname.split("/")[2];
  useEffect(() => {
    if (!option) navigate("/admin-panel/comments");
  }, [option]);

  return (
    <div className="admin-panel">
      <div className="admin-panel__content-list">
        <div className="admin-panel__content-header">Форум</div>

        <NavLink
          to={`/admin-panel/posts`}
          className={`admin-panel__content-item ${
            option === "posts" ? "_active" : ""
          }`}
        >
          Темы
        </NavLink>
        <NavLink
          to={`/admin-panel/comments`}
          className={`admin-panel__content-item ${
            option === "comments" ? "_active" : ""
          }`}
        >
          Комментарии
        </NavLink>
      </div>
      <div className="admin-panel__content">
        <Outlet />
      </div>
    </div>
  );
};
