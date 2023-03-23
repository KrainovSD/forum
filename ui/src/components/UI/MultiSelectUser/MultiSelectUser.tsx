import { getAvatar } from "../../../helpers/getAvatar";
import { SmallLoader } from "../../../components/SmallLoader/SmallLoader";
import { useState } from "react";
import "./MultiSelectUser.scss";
import { useEvent, THandlerEvent } from "../../../hooks/useEvent";
import { Animation } from "../../../components/Animation/Animation";

interface IMultiSelectUserProps {
  selectItems: IMultiSelectUserItem[];
  selectValue: string[];
  setSelectValue: (v: IMultiSelectUserItem) => void;
  isLoading: boolean;
}

export interface IMultiSelectUserItem {
  avatar: string;
  id: string;
  nickName: string;
}

export const MultiSelectUser: React.FC<IMultiSelectUserProps> = ({
  selectItems,
  selectValue,
  setSelectValue,
  isLoading,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => {
    const value = isVisible ? false : true;
    setIsVisible(value);
  };

  const handlerEvent: THandlerEvent = (e) => {
    const element = e.target as HTMLElement;
    if (element.classList.contains("select")) return;
    setIsVisible(false);
  };
  useEvent("click", handlerEvent);

  return (
    <div className="select-user select">
      {isLoading && <SmallLoader />}
      <div className="select-user__field select" onClick={toggleVisible}>
        Открыть список
      </div>
      <Animation className="appear-anim" isVisible={isVisible}>
        <div className="select-user__sub-menu select">
          {selectItems.map((item) => (
            <div
              className={`select-user__sub-menu-item ${
                selectValue.includes(`${item.id}`) ? "_selected" : ""
              } select`}
              key={item.id}
              onClick={() => {
                setSelectValue(item);
              }}
            >
              <div className="_avatar select">
                <img
                  className="select"
                  src={getAvatar(item.avatar, item.id)}
                  alt=""
                />
              </div>
              <div className="_nick select">{item.nickName}</div>
            </div>
          ))}
        </div>
      </Animation>
    </div>
  );
};
