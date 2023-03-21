import { useDateFormat } from "../../../../hooks/useDateFormat";
import { ILike } from "../../../../store/reducers/like/likeTypes";
import { getAvatar } from "../../../../helpers/getAvatar";
import "./AuthorLikeItem.scss";
import { NavLink } from "react-router-dom";
import { getUserLink } from "../../../../helpers/getLinks";

interface IAuthorLikeProps {
  like: ILike;
}

export const AuthorLikeItem: React.FC<IAuthorLikeProps> = ({ like }) => {
  const avatar = getAvatar(like.fromAvatar, like.fromID);
  const date = useDateFormat(like.date);
  const userLink = getUserLink(like.fromID);
  return (
    <div className="author-like">
      <NavLink to={userLink} className="author-like__avatar">
        <img src={avatar} alt="" />
      </NavLink>
      <div className="author-like__info">
        <NavLink to={userLink} className="_nick">
          {like.fromNickName}
        </NavLink>
        <div className="_date">{date}</div>
      </div>
    </div>
  );
};
