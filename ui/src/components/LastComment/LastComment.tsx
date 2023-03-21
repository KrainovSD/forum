import { useDateFormat } from "../../hooks/useDateFormat";
import { NavLink } from "react-router-dom";
import "./LastComment.scss";
import { getAvatar } from "../../helpers/getAvatar";
import { getPostLink, getUserLink } from "../../helpers/getLinks";

interface ILastComment {
  userID: string;
  avatar: string;
  nickName: string;
  date: string;
  commentID?: string;
  postTitle?: string;
  postID?: string;
}

interface ILastCommentProps {
  lastComment: ILastComment;
}

export const LastComment: React.FC<ILastCommentProps> = ({ lastComment }) => {
  const date = useDateFormat(lastComment.date);
  const avatar = getAvatar(lastComment.avatar, lastComment.userID);
  const linkUser = getUserLink(lastComment.userID);

  return (
    <div>
      {lastComment && (
        <div className="last-comment__last-message">
          <NavLink to={linkUser} className="last-comment__last-message-avatar">
            <img src={avatar} alt="" />
          </NavLink>
          <div className="last-comment__last-message-info">
            {lastComment?.postID && (
              <NavLink to={getPostLink(lastComment.postID)} className="_post">
                {lastComment.postTitle}
              </NavLink>
            )}
            <p className="_user">
              {`От `}
              <NavLink to={linkUser} className="_blue">
                {lastComment.nickName}
              </NavLink>
              , {date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
