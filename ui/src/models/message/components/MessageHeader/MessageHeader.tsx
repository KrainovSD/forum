import { ICurrentSession } from "models/message/MessageList";
import { NavLink } from "react-router-dom";
import { getAvatar } from "../../../../helpers/getAvatar";
import arrowLeft from "../../../../assets/media/arrow-left.png";
import cancel from "../../../../assets/media/cancel.png";
import "./MessageHeader.scss";
import { getCountCommentMessageCaption } from "../../../../helpers/getCaption";
import { DeleteMessage } from "../DeleteMessage/DeleteMessage";
import { SessionOptions } from "../Options/SessionOptions";
import { DeleteSession } from "../DeleteSession/DeleteSession";
import { useConfirm } from "../../../../hooks/useConfirm";

interface IMessageHeaderProps {
  sessionInfo: ICurrentSession;
  multipleSelect: string[];
  clearSelect: () => void;
}

export const MessageHeader: React.FC<IMessageHeaderProps> = ({
  sessionInfo,
  multipleSelect,
  clearSelect,
}) => {
  const isConference = (v: string[]) => {
    return v.length > 1;
  };
  const { confirm, checkConfirm } = useConfirm();

  if (multipleSelect.length > 0)
    return (
      <div className="message-header">
        <div className="message-header__cancel-select">
          <p>
            {multipleSelect.length}{" "}
            {getCountCommentMessageCaption(multipleSelect.length)}
          </p>
          <img
            src={cancel}
            alt=""
            onClick={() => {
              clearSelect();
            }}
          />
        </div>
        <DeleteMessage commentID={multipleSelect} clearSelect={clearSelect} />
      </div>
    );

  return (
    <div className="message-header">
      {confirm}
      <NavLink to={"/message"} className="message-header__back">
        <img src={arrowLeft} alt="" />
        Назад
      </NavLink>
      <div className="message-header__members">
        {sessionInfo.otherUsersNickName.join(", ")}
      </div>
      <div className="message-header__tools">
        <SessionOptions>
          <DeleteSession
            sessionID={sessionInfo.sessionID}
            checkConfirm={checkConfirm}
          />
        </SessionOptions>

        <div className="message-header__avatar">
          {isConference(sessionInfo.otherUsersID) && (
            <img src={getAvatar("", "")} alt="" />
          )}
          {!isConference(sessionInfo.otherUsersID) && (
            <img
              src={getAvatar(
                sessionInfo.otherUsersAvatar[0],
                sessionInfo.otherUsersID[0]
              )}
              alt=""
            />
          )}
        </div>
      </div>
    </div>
  );
};
