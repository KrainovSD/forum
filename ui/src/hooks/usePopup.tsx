import { Popup } from "../components/Popup/Popup";
import { CSSTransition } from "react-transition-group";
import { useState } from "react";

export const usePopup = (customCallback: () => void) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const clearData = () => {
    setIsVisible(false);
    setTitle("");
    setBody("");
  };
  const setPopup = (title: string, body: string) => {
    setIsVisible(true);
    setTitle(title);
    setBody(body);
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
          customCallback();
        }}
      />
    </CSSTransition>
  );

  return { setBody, setTitle, setIsVisible, popup, setPopup };
};
