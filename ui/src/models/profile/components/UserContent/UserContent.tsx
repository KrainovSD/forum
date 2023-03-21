import { Outlet } from "react-router-dom";
import { ContentNavBar } from "../ContentNavBar/ContentNavBar";
import "./UserContent.scss";
export const UserContent: React.FC = () => {
  return (
    <div className="user-content">
      <div className="user-content__nav-bar">
        <ContentNavBar />
      </div>
      <div className="user-content__content">
        <Outlet />
      </div>
    </div>
  );
};
