import { Animation } from "../../../../components/Animation/Animation";
import "./Options.scss";
import { useState, PropsWithChildren } from "react";
import options from "../../../../assets/media/option.png";

export const SessionOptions: React.FC<PropsWithChildren> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div
      className="session-options no-interaction"
      onMouseOver={() => {
        setIsVisible(true);
      }}
      onMouseOut={() => {
        setIsVisible(false);
      }}
    >
      <img src={options} className="no-interaction" />
      <Animation className="appear-anim" isVisible={isVisible}>
        <div className="session-options__sub-menu no-interaction">
          {children}
        </div>
      </Animation>
    </div>
  );
};
