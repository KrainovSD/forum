import { useAppDispatch } from "../../../../hooks/redux";
import { useConfirm } from "../../../../hooks/useConfirm";
import { deleteMessage } from "../../../../store/reducers/message/messageActionCreator";
import "./DeleteMessage.scss";

interface IDeleteMessageProps {
  commentID: string[];
  clearSelect: () => void;
}

export const DeleteMessage: React.FC<IDeleteMessageProps> = ({
  commentID,
  clearSelect,
}) => {
  const dispatch = useAppDispatch();
  const { checkConfirm, confirm } = useConfirm();

  const removeMessage = () => {
    dispatch(deleteMessage(commentID));
    clearSelect();
  };

  return (
    <div>
      {confirm}
      <div
        className="delete-message"
        onClick={() => {
          checkConfirm(
            "Сообщения",
            "Вы уверены, что хотите удалить сообщения?",
            removeMessage
          );
        }}
      >
        Удалить
      </div>
    </div>
  );
};
