import { BlackButton } from "../../components/UI/BlackButton/BlackButton";
import "./Popup.scss";

export interface IPopup {
  title: string;
  body: string;
  isVisible: boolean;
}

interface IPopupProps {
  title: string;
  body: string;
  action: () => void;
}

export const Popup: React.FC<IPopupProps> = ({ title, body, action }) => {
  const linesBody = body.split("\\n");

  return (
    <div className="back-drop__popup">
      <div className="popup">
        <h1 className="popup__title">{title}</h1>
        {linesBody.map((line, id) => (
          <p
            className={`popup__body ${line.length === 0 ? "_enter" : ""} `}
            key={id}
          >
            {line}
          </p>
        ))}

        <BlackButton
          onClick={() => {
            action();
          }}
        >
          ОК
        </BlackButton>
      </div>
    </div>
  );
};
