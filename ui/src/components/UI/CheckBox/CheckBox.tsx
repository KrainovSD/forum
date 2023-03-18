import "./CheckBox.scss";

interface IChecBoxProps {
  title: string;
  value: boolean;
  setValue: () => void;
}

export const CheckBox: React.FC<IChecBoxProps> = ({
  title,
  value,
  setValue,
}) => {
  return (
    <div className="check-box">
      <div
        className={`check-box__custom ${value ? "_checked" : ""}`}
        onClick={setValue}
      ></div>
      <p className="check-box__label">{title}</p>
    </div>
  );
};
