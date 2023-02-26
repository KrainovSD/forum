import { useState } from "react";
import "./InputTooltip.scss";

interface InputTooltipProps {
  type: string;
  title: string;
  error: string;
  value: string;
  setValue: (s: string) => void;
}

export const InputTooltip: React.FC<InputTooltipProps> = ({
  type,
  title,
  error,
  value,
  setValue,
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <div className="input-tooltip__wrapper">
      <p className="input-tooltip__title">{title}</p>
      {error.length > 0 && isFocus && (
        <div className="input-tooltip__tooltip" data-inputtooltip={error}></div>
      )}
      <input
        type={type}
        className={`input-tooltip__input  ${error.length > 0 ? "_error" : ""} ${
          isFocus ? "_active" : ""
        }`}
        placeholder={title}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
