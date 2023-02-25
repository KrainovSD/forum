import doc from "../../../../assets/media/doc.png";
import "./Navbar.scss";

export const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <div className="navbar__item">
        <img src={doc} alt="" />
        <p>Правила форума</p>
      </div>
      <div className="navbar__item">
        <img src={doc} alt="" />
        <p>KR Dictionary</p>
      </div>
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
