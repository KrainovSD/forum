import { getAvatar } from "../../../../helpers/getAvatar";
import { IMessage } from "store/reducers/message/messageTypes";
import "./MessageItem.scss";
import { NavLink } from "react-router-dom";
import { getUserLink } from "../../../../helpers/getLinks";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import { Dispatch, SetStateAction, useState } from "react";
import pencil from "../../../../assets/media/pencil.png";
import checkList from "../../../../assets/media/checklist.png";

import { getDiffInHours } from "../../../../helpers/getDiffInTimes";
import { ReactReduxContextInstance } from "react-redux/es/components/Context";

interface IMessageItemProps {
  message: IMessage;
  multipleSelect: string[];
  selectItem: (id: string) => void;
  editID: string;
  fillEdit: (id: string, value: string) => void;
}

export const MessageItem: React.FC<IMessageItemProps> = ({
  message,
  multipleSelect,
  selectItem,
  editID,
  fillEdit,
}) => {
  const date = useDateFormat(message.date);
  const [isHovering, setIsHovering] = useState(false);

  const selectHandler = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLElement;
    if (element.classList.contains("edit")) return;
    selectItem(`${message.id}`);
  };

  return (
    <div
      className={`message-item ${editID == message.id ? "_edit" : ""} ${
        multipleSelect.includes(`${message.id}`) ? "_selected" : ""
      }`}
      onMouseOver={() => {
        setIsHovering(true);
      }}
      onMouseOut={() => {
        setIsHovering(false);
      }}
      onClick={selectHandler}
    >
      <div className="message-item__select">
        {((isHovering && editID.length === 0) ||
          multipleSelect.includes(`${message.id}`)) && (
          <img src={checkList} alt="" />
        )}
      </div>
      <NavLink
        to={getUserLink(message.fromID)}
        className="message-item__avatar"
      >
        <img src={getAvatar(message.fromAvatar, message.fromID)} alt="" />
      </NavLink>
      <div className="message-item__info">
        <div className="message-item__header">
          <NavLink
            to={getUserLink(message.fromID)}
            className="message-item__author"
          >
            {message.fromNickName}
          </NavLink>
          <div className="message-item__date">
            {date}
            {message.updated ? " (Изменено)" : ""}
          </div>
          {isHovering &&
            editID.length === 0 &&
            multipleSelect.length === 0 &&
            getDiffInHours(message.date) < 1 && (
              <div
                data-tooltip-left="Редактировать"
                className="message-item__edit edit"
              >
                <img
                  className="edit"
                  src={pencil}
                  alt=""
                  onClick={() => {
                    fillEdit(`${message.id}`, message.body);
                  }}
                />
              </div>
            )}
        </div>
        <div className="message-item__body">{message.body}</div>
      </div>
    </div>
  );
};
