import { Popup } from "../components/Popup/Popup";
import { CSSTransition } from "react-transition-group";
import { useState, useCallback } from "react";

type IusePopup = (customCallback?: () => void) => {
  popup: JSX.Element;
  setPopup: IsetPopup;
};
type IsetPopup = (
  title: string,
  body: string,
  newCallback?: (() => void) | null
) => void;

export const usePopup: IusePopup = (customCallback = () => {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [callback, setCallback] = useState(() => customCallback);

  const setPopup: IsetPopup = (title, body, newCallback = null) => {
    setIsVisible(true);
    setTitle(title);
    setBody(body);
    if (newCallback) setCallback(() => newCallback);
    else if (!newCallback) setCallback(() => customCallback);
  };

  const popup = (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="appear-anim"
      unmountOnExit
    >
      <Popup
        title={title}
        body={body}
        action={() => {
          setIsVisible(false);
          callback();
        }}
      />
    </CSSTransition>
  );

  return { popup, setPopup };
};
