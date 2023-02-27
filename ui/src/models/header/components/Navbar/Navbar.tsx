import { NavLink } from "react-router-dom";
import doc from "../../../../assets/media/doc.png";
import "./Navbar.scss";

export const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <NavLink to="/rules" className="navbar__item">
        <img src={doc} alt="" />
        <p>Правила форума</p>
      </NavLink>
      <NavLink to="https://krainovdictionary.ru/" className="navbar__item">
        <img src={doc} alt="" />
        <p>KR Dictionary</p>
      </NavLink>
      <div className="navbar__item">
        <img src={doc} alt="" />
        <p>VK</p>
      </div>
      <div className="navbar__search">
        <input type="text" placeholder="Поиск..." />
        <div className="navbar__search-img"></div>
      </div>
    </div>
  );
};
