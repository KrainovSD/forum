import { useDateFormat } from "../../hooks/useDateFormat";
import { NavLink } from "react-router-dom";
import userAvatar from "../../assets/media/user.png";
import "./LastComment.scss";

interface lastCommet {
  userID: number;
  avatar: string;
  nickName: string;
  date: string;
  commentID?: number;
  postTitle?: string;
  postID?: number;
}

interface LastCommentProps {
  lastComment: lastCommet | null;
}

export const LastComment: React.FC<LastCommentProps> = ({ lastComment }) => {
  let date: string | undefined;
  if (lastComment) date = useDateFormat(lastComment.date);

  const avatar = lastComment && lastComment?.avatar ? "путь" : userAvatar;

  return (
    <div>
      {lastComment && (
        <div className="last-comment__last-message">
          <NavLink
            to={`/profile/${lastComment.userID}`}
            className="last-comment__last-message-avatar"
          >
            <img src={avatar} alt="" />
          </NavLink>
          <div className="last-comment__last-message-info">
            {lastComment?.postID && (
              <NavLink to={`/post/${lastComment.postID}`} className="_post">
                {lastComment.postTitle}
              </NavLink>
            )}
            <p className="_user">
              {`От `}
              <NavLink to={`/profile/${lastComment.userID}`} className="_blue">
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
