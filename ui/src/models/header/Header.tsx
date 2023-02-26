import "./Header.scss";
import KrainovLogo from "../../assets/logo/KrainovLogoWhite.png";
import { Userbar } from "./components/Userbar/Userbar";
import { Navbar } from "./components/Navbar/Navbar";
import { PreContentBar } from "../../components/PreContentBar/PreContentBar";

export const Header: React.FC = () => {
  return (
    <div className="header__wrapper">
      <div className="header">
        <div className="header__content">
          <img className="header__logo" src={KrainovLogo} alt="" />
          <Userbar />
        </div>
        <Navbar />
      </div>
      <PreContentBar />
    </div>
  );
};
