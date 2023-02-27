import { BlackButton } from "../../components/UI/BlackButton/BlackButton";
import "./Popup.scss";

interface PopupProps {
  title: string;
  body: string;
  action: () => void;
}

export const Popup: React.FC<PopupProps> = ({ title, body, action }) => {
  const linesBody = body.split("\\n");

  return (
    <div className="backDrop">
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
