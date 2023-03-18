import { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getTopicByParentID } from "../../store/reducers/topic/topicActionCreator";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TopicItem } from "./components/TopicItem/TopicItem";
import "./TopicList.scss";
import { useEffectOnlyUpdate } from "../../hooks/useResponse";
import { usePopup } from "../../hooks/usePopup";
import { TopicAdminPanel } from "./components/TopicAdminPanel/TopicAdminPanel";

export const TopicList: React.FC = () => {
  const { userInfo } = useAppSelector((state) => state.user);
  const { id: topicID } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { topics, parentInfo, statusError, response, updated } = useAppSelector(
    (state) => state.topic
  );

  const getTopics = () => {
    const parentID = topicID ? topicID : null;
    dispatch(getTopicByParentID(parentID));
  };
  useEffect(getTopics, [topicID]);
  useEffectOnlyUpdate(() => {
    if (updated) getTopics();
  }, [updated]);

  useEffect(() => {
    if (statusError === 404) navigate("/", { replace: true });
  }, [statusError]);

  const { popup, setPopup } = usePopup();
  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Топики", response);
  }, [response]);

  return (
    <div className="topic-list__wrapper">
      {popup}
      {parentInfo?.title && (
        <div className="topic-list__parent-topic-title">
          <p>{parentInfo.title}</p>{" "}
          <TopicAdminPanel
            access={parentInfo.accessPost}
            topicID={parentInfo.id}
          />
        </div>
      )}
      {userInfo && userInfo.role === "admin" && (
        <NavLink
          to={`/create/topic${topicID ? `/${topicID}` : ""}`}
          className="topic-list__create-topic"
        >
          Создать топик
        </NavLink>
      )}
      {parentInfo?.title && topics.length > 0 && (
        <div className="topic-list__sub-topic">Подфорумы</div>
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
