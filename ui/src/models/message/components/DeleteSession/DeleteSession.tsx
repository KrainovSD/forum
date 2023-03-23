import "./DeleteSession.scss";
import remove from "../../../../assets/media/remove.png";
import { useAppDispatch } from "../../../../hooks/redux";
import { IcheckConfirm } from "../../../../hooks/useConfirm";
import { deleteSession } from "../../../../store/reducers/message/messageActionCreator";
import { useNavigate } from "react-router-dom";

interface IDeleteSessionProps {
  sessionID: string;
  checkConfirm: IcheckConfirm;
}

export const DeleteSession: React.FC<IDeleteSessionProps> = ({
  sessionID,
  checkConfirm,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const removeSession = () => {
    dispatch(deleteSession(sessionID));
    navigate("/message");
  };

  return (
    <div
      className="delete-session _active"
      onClick={() => {
        checkConfirm(
          "Сообщения",
          "Вы уверены, что хотите удалить историю сообщений?",
          removeSession
        );
      }}
    >
      <img src={remove} alt="" className="_active" />
      <p className="_active">Очистить историю сообщений</p>
    </div>
  );
};
