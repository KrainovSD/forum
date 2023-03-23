import { getAvatar } from "../../../../helpers/getAvatar";
import { ISession } from "store/reducers/message/messageTypes";
import "./SessionItem.scss";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { SessionOptions } from "../Options/SessionOptions";
import { DeleteSession } from "../DeleteSession/DeleteSession";
import { useConfirm } from "../../../../hooks/useConfirm";
import { getUserLink } from "../../../../helpers/getLinks";

interface ISessionItem {
  session: ISession;
}

export const SessionItem: React.FC<ISessionItem> = ({ session }) => {
  const isConference = session.otherUsersID.length > 1;
  const date = useDateFormat(session.lastMessage.lastDate);
  const [isHovering, setIsHovering] = useState(false);

  const { confirm, checkConfirm } = useConfirm();
  const navigate = useNavigate();
  const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLElement;
    console.log(element);
    if (
      element.classList.contains("_active") ||
      element.classList.contains("no-interaction")
    )
      return;
    navigate(`/message/id/${session.sessionID}`);
  };

  return (
    <div
      className={`session-item ${
        session.unViewedCountMessage > 0 ? "_unviewed" : ""
      }`}
      onMouseOver={() => {
        setIsHovering(true);
      }}
      onMouseOut={() => {
        setIsHovering(false);
      }}
      onClick={clickHandler}
    >
      {confirm}
      {!isConference && (
        <NavLink
          className="session-item__avatar no-interaction"
          to={getUserLink(session.otherUsersID[0])}
        >
          <img
            src={getAvatar(
              session?.otherUsersAvatar?.[0],
              session?.otherUsersID?.[0]
            )}
            alt=""
          />
        </NavLink>
      )}

      {isConference && (
        <div className="session-item__avatar">
          <img src={getAvatar("", "")} alt="" />
        </div>
      )}
      <div className="session-item__info-wrapper">
        <div className="session-item__info-header">
          <div className="session-item__members">
            {session.otherUsersNickName.map((nickName, index) => (
              <NavLink
                className="no-interaction"
                to={getUserLink(session.otherUsersID[index])}
                key={nickName}
              >
                {nickName}
                {session.otherUsersNickName.length - 1 !== index ? ", " : ""}
              </NavLink>
            ))}
          </div>
          <div className="session-item__tools">
            <p className="session-item__last-message-date">{date}</p>
            <div className="session-item__options no-interaction">
              {isHovering && (
                <SessionOptions>
                  <DeleteSession
                    sessionID={session.sessionID}
                    checkConfirm={checkConfirm}
                  />
                </SessionOptions>
              )}
            </div>
          </div>
        </div>
        <div className="session-item__info-last-message">
          <div className="session-item__avatar-last-message">
            <img
              src={getAvatar(
                session.lastMessage.authorAvatar,
                session.lastMessage.authorID
              )}
              alt=""
            />
          </div>
          <div className="session-item__body-last-message">
            {session.lastMessage.body}
          </div>
          {session.unViewedCountMessage > 0 && (
            <div className="session-item__unreader-message">
              {session.unViewedCountMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
