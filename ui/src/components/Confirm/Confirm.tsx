import { BlackButton } from "../UI/BlackButton/BlackButton";
import "./Confirm.scss";

interface IConfirmProps {
  title: string;
  body: string;
  actionOK: () => void;
  actionCancel: () => void;
}

export const Confirm: React.FC<IConfirmProps> = ({
  title,
  body,
  actionOK,
  actionCancel,
}) => {
  const linesBody = body.split("\\n");
  return (
    <div className="back-drop__popup">
      <div className="confirm">
        <h1 className="confirm__title">{title}</h1>
        {linesBody.map((line, id) => (
          <p
            className={`confirm__body ${line.length === 0 ? "_enter" : ""} `}
            key={id}
          >
            {line}
          </p>
        ))}
        <div className="confirm__button-wrapper">
          <div className="_button">
            <BlackButton
              onClick={() => {
                actionOK();
              }}
            >
              Да
            </BlackButton>
          </div>
          <div className="_button">
            <BlackButton
              onClick={() => {
                actionCancel();
              }}
            >
              Нет
            </BlackButton>
          </div>
        </div>
      </div>
    </div>
  );
};
