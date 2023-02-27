import "./Header.scss";
import KrainovLogo from "../../assets/logo/KrainovLogoWhite.png";
import { Userbar } from "./components/Userbar/Userbar";
import { Navbar } from "./components/Navbar/Navbar";
import { PreContentBar } from "../../components/PreContentBar/PreContentBar";
import { NavLink } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <div className="header__wrapper">
      <div className="header">
        <div className="header__content">
          <NavLink to="/" className="header__logo">
            <img src={KrainovLogo} alt="" />
          </NavLink>
          <Userbar />
        </div>
        <Navbar />
      </div>
      <PreContentBar />
    </div>
  );
};
