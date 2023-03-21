import { Outlet } from "react-router-dom";
import "./Setting.scss";
import { SettingNavBar } from "./components/SettingNavBar/SettingNavBar";

export const Setting: React.FC = () => {
  return (
    <div className="setting">
      <div className="setting__nav-bar">
        <SettingNavBar />
      </div>
      <div className="setting_content">
        <Outlet />
      </div>
    </div>
  );
};
