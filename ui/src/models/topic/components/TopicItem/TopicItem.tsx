import "./TopicItem.scss";
import chatIcon from "../../../../assets/media/comment.png";
import { ItopicType } from "../../../../store/reducers/topic/topicTypes";
import { NavLink } from "react-router-dom";
import { LastComment } from "../../../../components/LastComment/LastComment";
import { TopicAdminPanel } from "../TopicAdminPanel/TopicAdminPanel";
import { useAppSelector } from "../../../../hooks/redux";
import { getTopicLink } from "../../../../helpers/getLinks";

interface TopicItemProps {
  topic: ItopicType;
}

export const TopicItem: React.FC<TopicItemProps> = ({ topic }) => {
  const { userInfo } = useAppSelector((state) => state.user);

  return (
    <div className="topic-item">
      <div className="topic-item__content">
        <img src={chatIcon} alt="" className="topic-item__icon" />
        <div className="topic-item__title">
          <NavLink to={getTopicLink(topic.id)} className="_title">
            {topic.title}
          </NavLink>
          <div className="topic-item__sub-title-list">
            {topic.subTitleList.length > 0 &&
              topic.subTitleList.map((subTitle) => (
                <NavLink
                  className="_sub-title"
                  key={subTitle.id}
                  to={getTopicLink(subTitle.id)}
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
        {topic.lastComment && <LastComment lastComment={topic.lastComment} />}
      </div>
      {userInfo && userInfo.role === "admin" && (
        <TopicAdminPanel access={topic.accessPost} topicID={topic.id} />
      )}
    </div>
  );
};
