import { getUserContentLink } from "../../../../helpers/getLinks";
import { NavLink, useLocation, useParams } from "react-router-dom";
import "./ContentNavBar.scss";

export const ContentNavBar: React.FC = () => {
  const { id } = useParams();
  const locate = useLocation();
  const option = locate.pathname.split("/")[3];

  return (
    <div className="content-nav-bar__content-list">
      {id && (
        <div className="content-nav-bar__content-wrapper">
          <div className="content-nav-bar__content-header">Форум</div>
          <NavLink
            to={getUserContentLink(id, "posts")}
            className={`content-nav-bar__content-item ${
              option === "posts" ? "_active" : ""
            }`}
          >
            Темы
          </NavLink>
          <NavLink
            to={getUserContentLink(id, "comments")}
            className={`content-nav-bar__content-item ${
              option === "comments" ? "_active" : ""
            }`}
          >
            Комментарии
          </NavLink>
        </div>
      )}
    </div>
  );
};
