import { useDateFormat } from "../../../../hooks/useDateFormat";
import { ILike } from "../../../../store/reducers/like/likeTypes";
import { getAvatar } from "../../../../helpers/getAvatar";
import "./AuthorLikeItem.scss";
import { NavLink } from "react-router-dom";

interface IAuthorLikeProps {
  like: ILike;
}

export const AuthorLikeItem: React.FC<IAuthorLikeProps> = ({ like }) => {
  const avatar = getAvatar(like.fromAvatar, like.fromID);
  const date = useDateFormat(like.date);
  return (
    <div className="author-like">
      <NavLink to={`/profile/${like.fromID}`} className="author-like__avatar">
        <img src={avatar} alt="" />
      </NavLink>
      <div className="author-like__info">
        <NavLink to={`/profile/${like.fromID}`} className="_nick">
          {like.fromNickName}
        </NavLink>
        <div className="_date">{date}</div>
      </div>
    </div>
  );
};
