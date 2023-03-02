import "./TopicItem.scss";
import chatIcon from "../../../../assets/media/comment.png";
import userAvatar from "../../../../assets/media/user.png";
import { topicType } from "../../../../store/reducers/topic/topicTypes";
import { NavLink } from "react-router-dom";
import { useDateFormat } from "../../../../hooks/useDateFormat";

interface TopicItemProps {
  topic: topicType;
}

export const TopicItem: React.FC<TopicItemProps> = ({ topic }) => {
  let date: string | undefined;
  if (topic.lastComment) date = useDateFormat(topic.lastComment.date);
  let avatar = userAvatar;
  if (topic.lastComment?.avatar) {
    avatar = `путь до картинки`;
  }

  return (
    <div className="topic-item">
      <img src={chatIcon} alt="" className="topic-item__icon" />
      <div className="topic-item__title">
        <NavLink to={`/topic/${topic.id}`} className="_title">
          {topic.title}
        </NavLink>
        <div className="topic-item__sub-title-list">
          {topic.subTitleList.length > 0 &&
            topic.subTitleList.map((subTitle) => (
              <NavLink
                className="_sub-title"
                key={subTitle.id}
                to={`/topic/${subTitle.id}`}
              >
                {subTitle.title}
              </NavLink>
            ))}
        </div>
      </div>
      <div className="topic-item__message-info">
        <h1>{topic.countComment}</h1>
        <p>сообщений</p>
      </div>
      {topic.lastComment && (
        <div className="topic-item__last-message">
          <NavLink
            to={`/profile/${topic.lastComment.userID}`}
            className="topic-item__last-message-avatar"
          >
            <img src={avatar} alt="" />
          </NavLink>
          <div className="topic-item__last-message-info">
            <NavLink to={`/post/${topic.lastComment.postID}`} className="_post">
              {topic.lastComment.postTitle}
            </NavLink>
            <p className="_user">
              {`От `}
              <NavLink
                to={`/profile/${topic.lastComment.userID}`}
                className="_blue"
              >
                {topic.lastComment.nickName}
              </NavLink>
              , {date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
