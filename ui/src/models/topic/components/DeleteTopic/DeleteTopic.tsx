import { useConfirm } from "../../../../hooks/useConfirm";
import { useAppDispatch } from "../../../../hooks/redux";
import { deleteTopic } from "../../../../store/reducers/topic/topicActionCreator";

interface IDeleteTopicProps {
  topicID: string;
}

export const DeleteTopic: React.FC<IDeleteTopicProps> = ({ topicID }) => {
  const dipatch = useAppDispatch();
  const { confirm, checkConfirm } = useConfirm();
  const removeTopic = () => {
    dipatch(deleteTopic(topicID));
  };

  return (
    <div>
      {confirm}
      <div
        className="topic-admin-panel__item"
        onClick={() => {
          checkConfirm(
            "Удаление топика",
            "Вы уверены, что хотите удалить топик?",
            removeTopic
          );
        }}
      >
        Удалить
      </div>
    </div>
  );
};
