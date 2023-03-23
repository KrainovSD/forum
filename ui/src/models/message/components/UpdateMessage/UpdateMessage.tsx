import { useAppDispatch } from "../../../../hooks/redux";
import { useConfirm } from "../../../../hooks/useConfirm";
import { updateMessage } from "../../../../store/reducers/message/messageActionCreator";
import { useState, useEffect } from "react";
import "./UpdateMessage.scss";
import { CommentEditor } from "../CommentEditor/CommentEditor";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import cancel from "../../../../assets/media/cancel.png";

interface IUpdateMessageProps {
  messageID: string;
  defaultValue: string;
  clearEdit: () => void;
}

export const UpdateMessage: React.FC<IUpdateMessageProps> = ({
  defaultValue,
  messageID,
  clearEdit,
}) => {
  const dispatch = useAppDispatch();
  const { checkConfirm, confirm } = useConfirm();
  const [body, setBody] = useState("");
  useEffect(() => {
    setBody(defaultValue);
  }, []);

  const editMessage = () => {
    dispatch(updateMessage({ body, messageID }));
    clearEdit();
  };
  const checkMessage = () => {
    if (body.length === 0) return;
    checkConfirm(
      "Сообщение",
      "Вы уверены, что хотите изменить сообщение?",
      editMessage
    );
  };
  return (
    <div>
      <div className="update-message">
        {confirm}

        <div className="update-message__editor-wrapper">
          <div className="update-message__tools">
            <div className="update-message__caption">
              Редактирование сообщения
            </div>
            <img
              src={cancel}
              alt=""
              className="update-message__cancel"
              onClick={() => {
                clearEdit();
              }}
            />
          </div>
          <CommentEditor value={body} setValue={setBody} />
        </div>

        <div className="update-message__button-wrapper">
          <BlackButton
            data-disabled={!(body.length > 0)}
            onClick={checkMessage}
          >
            Изменить
          </BlackButton>
        </div>
      </div>
    </div>
  );
};
