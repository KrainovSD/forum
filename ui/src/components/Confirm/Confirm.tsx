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
    <div className="back-drop__popup no-interaction">
      <div className="confirm no-interaction">
        <h1 className="confirm__title no-interaction">{title}</h1>
        {linesBody.map((line, id) => (
          <p
            className={`confirm__body ${
              line.length === 0 ? "_enter" : ""
            } no-interaction`}
            key={id}
          >
            {line}
          </p>
        ))}
        <div className="confirm__button-wrapper no-interaction">
          <div className="_button no-interaction">
            <BlackButton
              onClick={() => {
                actionOK();
              }}
            >
              Да
            </BlackButton>
          </div>
          <div className="_button no-interaction">
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
