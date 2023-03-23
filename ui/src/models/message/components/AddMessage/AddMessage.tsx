import { CommentEditor } from "../CommentEditor/CommentEditor";
import { useState, useEffect } from "react";
import "./AddMessage.scss";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { useAppDispatch } from "../../../../hooks/redux";
import { createMessage } from "../../../../store/reducers/message/messageActionCreator";
import { useConfirm } from "../../../../hooks/useConfirm";

interface IAddMessageProps {
  defaultMembers: string[];
}

export const AddMessage: React.FC<IAddMessageProps> = ({ defaultMembers }) => {
  const dispatch = useAppDispatch();
  const { checkConfirm, confirm } = useConfirm();
  const [body, setBody] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  useEffect(() => {
    if (defaultMembers) setMembers(defaultMembers);
  }, [defaultMembers]);

  const addMessage = () => {
    dispatch(createMessage({ body, members }));
    setBody("");
  };
  const checkMessage = () => {
    if (body.length === 0 || members.length === 0) return;
    checkConfirm(
      "Сообщение",
      "Вы уверены, что хотите отправить сообщение?",
      addMessage
    );
  };

  return (
    <div className="add-message">
      {confirm}
      <CommentEditor value={body} setValue={setBody} />
      <div className="add-message__button-wrapper">
        <BlackButton
          data-disabled={!(body.length > 0 && members.length !== 0)}
          onClick={checkMessage}
        >
          Отправить
        </BlackButton>
      </div>
    </div>
  );
};
