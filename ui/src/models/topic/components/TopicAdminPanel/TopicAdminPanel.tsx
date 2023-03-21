import { NavLink } from "react-router-dom";
import { DeleteTopic } from "../DeleteTopic/DeleteTopic";
import "./TopicAdminPanel.scss";
import { useConfirm } from "../../../../hooks/useConfirm";
import { useAppDispatch } from "../../../../hooks/redux";
import { updateTopicAccess } from "../../../../store/reducers/topic/topicActionCreator";
import { getUpdateTopicLink } from "../../../../helpers/getLinks";

interface ITopicAdminPanelProps {
  access: boolean;
  topicID: string;
}

export const TopicAdminPanel: React.FC<ITopicAdminPanelProps> = ({
  access,
  topicID,
}) => {
  const updateTopicLink = getUpdateTopicLink(topicID);
  const dipatch = useAppDispatch();
  const { confirm, checkConfirm } = useConfirm();
  const updateAccess = () => {
    const value = access ? false : true;
    dipatch(updateTopicAccess({ topicID, value }));
  };

  return (
    <div className="topic-admin-panel">
      {confirm}
      <DeleteTopic topicID={topicID} />
      <NavLink to={updateTopicLink} className="topic-admin-panel__item">
        Изменить
      </NavLink>

      <div
        className="topic-admin-panel__item"
        onClick={() => {
          checkConfirm(
            "Статус топика",
            "Вы уверены, что хотите изменить статус доступа к созданию тем?",
            updateAccess
          );
        }}
      >
        <p>Создание тем</p>
        <input type="checkbox" checked={access ? true : false} readOnly />
      </div>
    </div>
  );
};
