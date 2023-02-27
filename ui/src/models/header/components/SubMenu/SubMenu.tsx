import out from "../../../../assets/media/out.png";
import setting from "../../../../assets/media/setting.png";
import { CSSTransition } from "react-transition-group";
import "./SubMenu.scss";

interface SubMenuProps {
  isVisible: boolean;
  logout: () => void;
}

export const SubMenu: React.FC<SubMenuProps> = ({ isVisible, logout }) => {
  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="userBarAnim"
      unmountOnExit
    >
      <div className="userBar__subMenu">
        <p className="userBar__subMenuHeader">НАСТРОЙКИ</p>
        <div className="userBar__subMenuItem">
          <img src={setting} alt="" />
          <p>Настройки профиля</p>
        </div>
        <div className="userBar__subMenuItem" onClick={logout}>
          <img src={out} alt="" />
          <p>Выйти</p>
        </div>
      </div>
    </CSSTransition>
  );
};
