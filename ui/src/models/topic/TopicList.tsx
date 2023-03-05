import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTopicByID } from "../../store/reducers/topic/topicActionCreator";
import { Loader } from "../../components/Loader/Loader";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TopicItem } from "./components/TopicItem/TopicItem";
import "./TopicList.scss";

export const TopicList: React.FC = () => {
  const { id: topicID } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { topics, parentInfo, statusError } = useAppSelector(
    (state) => state.topic
  );
  useEffect(() => {
    const parentID = topicID ? topicID : null;

    dispatch(getTopicByID(parentID));
  }, [topicID]);

  useEffect(() => {
    if (statusError === 404) navigate("/", { replace: true });
  }, [statusError]);

  return (
    <div className="topic-list__wrapper">
      {parentInfo?.title && (
        <div className="topic-list__info-wrapper">
          <div className="topic-list__parent-topic-title">
            {parentInfo.title}
          </div>
          {topics.length > 0 ? (
            <div className="topic-list__sub-topic">Подфорумы</div>
          ) : (
            ""
          )}
        </div>
      )}

      {topics.length > 0 ? (
        <div className="topic-list">
          {topics.map((topic) => (
            <TopicItem topic={topic} key={topic.id} />
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
