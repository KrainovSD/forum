import { getAdminPanelCommentsLink } from "../../helpers/getLinks";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminPanel.scss";
import { AdminPanelNavBar } from "./components/AdminPanelNavBar/AdminPanelNavBar";

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const locate = useLocation();
  const option = locate.pathname.split("/")[2];
  useEffect(() => {
    if (!option) navigate(getAdminPanelCommentsLink());
  }, [option]);

  return (
    <div className="admin-panel">
      <div className="admin-panel__nav-bar">
        <AdminPanelNavBar />
      </div>

      <div className="admin-panel__content">
        <Outlet />
      </div>
    </div>
  );
};
