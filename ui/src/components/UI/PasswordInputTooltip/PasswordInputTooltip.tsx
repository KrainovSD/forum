import { useMemo, useRef, useState } from "react";
import "./PasswordInputTooltip.scss";
import eyeOpen from "../../../assets/media/eye-open.png";
import eyeClose from "../../../assets/media/eye-close.png";

interface InputTooltipProps {
  title: string;
  error: string;
  value: string;
  setValue: (s: string) => void;
  advice?: boolean;
}

export const PasswordInputTooltip: React.FC<InputTooltipProps> = ({
  title,
  error,
  value,
  setValue,
  advice = false,
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>(null);

  const toggleEye = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const type =
      input.current?.getAttribute("type") === "password" ? "text" : "password";
    input.current?.setAttribute("type", type);

    const img = e.target as HTMLImageElement;
    const eye = type === "password" ? eyeOpen : eyeClose;
    img.setAttribute("src", `${eye}`);
  };

  let difficultPassword;

  if (advice) {
    difficultPassword = useMemo(() => {
      let difficult: number = 1;
      if (value.length > 8) {
        difficult++;
      }
      if (/\d/.test(value) && /[A-Za-zА-Яа-я]/.test(value)) {
        difficult++;
      }
      if (/[A-ZА-Я]/.test(value) && /[a-zа-я]/.test(value)) {
        difficult++;
      }
      if (/[!@#$%^&*()_+=\-"№;%:?\\/[\]{}|'~` ><,.]/.test(value)) {
        difficult++;
      }

      let difficultString: string = "_veryEasy";
      switch (difficult) {
        case 1: {
          difficultString = "_veryEasy";
          break;
        }
        case 2: {
          difficultString = "_easy";
          break;
        }
        case 3: {
          difficultString = "_medium";
          break;
        }
        case 4: {
          difficultString = "_high";
          break;
        }
        case 5: {
          difficultString = "_veryHigh";
          break;
        }
        default: {
          break;
        }
      }

      return difficultString;
    }, [value]);
  }

  return (
    <div className="password-input-tooltip__wrapper">
      <p className="password-input-tooltip__title">{title}</p>
      {error.length > 0 && isFocus && (
        <div className="input-tooltip__tooltip" data-inputtooltip={error}></div>
      )}
      <div
        className={`password-input-tooltip__inputWrapper ${
          error.length > 0 ? "_error" : ""
        } ${isFocus ? "_active" : ""}`}
      >
        <input
          type="password"
          className={`password-input-tooltip__input  `}
          placeholder={title}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ref={input}
        />
        <div className="password-input-tooltip__eye">
          <img onClick={toggleEye} src={eyeOpen} alt="" />
        </div>
      </div>
      {isFocus && advice && (
        <div className="password-input-tooltip__adviceWrapper">
          <div
            className={`password-input-tooltip__adviceBar ${difficultPassword}`}
          ></div>
        </div>
      )}
    </div>
  );
};
