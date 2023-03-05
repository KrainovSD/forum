import { useState } from "react";
import "./InputWarn.scss";

interface InputWarnProps {
  type: string;
  title: string;
  error: string;
  value: string | number;
  setValue: (s: string | number) => void;
}

export const InputWarn: React.FC<InputWarnProps> = ({
  type,
  title,
  error,
  value,
  setValue,
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <div className="input-warn__wrapper">
      {error.length > 0 && isFocus && (
        <div className="input-warn__tooltip" data-inputtooltip={error}></div>
      )}
      <input
        type={type}
        className={`input-warn__input  ${error.length > 0 ? "_error" : ""} ${
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
