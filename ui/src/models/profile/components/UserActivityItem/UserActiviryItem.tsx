import { getAvatar } from "../../../../helpers/getAvatar";
import { NavLink } from "react-router-dom";
import { ILastUserContent } from "../../../../store/reducers/user/userTypes";
import "./UserActivityItem.scss";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import commentBlack from "../../../../assets/media/comment-black.png";
import {
  getPostLink,
  getTopicLink,
  getUserLink,
} from "../../../../helpers/getLinks";

interface IUserActivityItemProps {
  userID: string;
  userAvatar: string;
  content: ILastUserContent;
}

export const UserActivityItem: React.FC<IUserActivityItemProps> = ({
  content,
  userAvatar,
  userID,
}) => {
  const avatar = getAvatar(userAvatar, userID);
  const date = useDateFormat(content.comment.date);
  const dateUpdate = useDateFormat(content.comment.update.date);
  const userLink = getUserLink(content.comment.update.authorID);
  const postLink = getPostLink(content.post.id);
  const topicLink = getTopicLink(content.topic.id);

  return (
    <div className="user-activiry-item">
      <div className="user-activiry-item__avatar">
        <img src={avatar} alt="" />
      </div>
      <div className="user-activiry-item__info">
        <div className="user-activiry-item__content-header">
          <NavLink to={postLink}>{content.post.title}</NavLink>
          <span>в</span>
          <NavLink to={topicLink}>{content.topic.title}</NavLink>
          {content.comment.main && (
            <div
              className="_mark"
              data-tooltip="Первый комментарий автора поста"
            >
              <img src={commentBlack} alt="" />
            </div>
          )}
        </div>
        <div className="user-activiry-item__content">
          <p className="user-activiry-item__body">{content.comment.body}</p>
          {content.comment.update.updated && (
            <p className="user-activiry-item__update">
              Изменено {dateUpdate} пользователем{" "}
              <NavLink className="_author" to={userLink}>
                {content.comment.update.authorNickName}
              </NavLink>
            </p>
          )}
          <p className="user-activiry-item__date">
            Опубликовано {date}{" "}
            {content.comment.update.updated ? "(изменено)" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};
