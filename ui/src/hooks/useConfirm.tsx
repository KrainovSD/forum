import { Confirm } from "../components/Confirm/Confirm";
import { CSSTransition } from "react-transition-group";
import { useState } from "react";

export const useConfirm = (OK: () => void, CANCEL: () => void = () => {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const checkConfirm = async (title: string, body: string) => {
    setIsVisible(true);
    setTitle(title);
    setBody(body);
  };

  const confirm = (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="appear-anim"
      unmountOnExit
    >
      <Confirm
        title={title}
        body={body}
        actionOK={() => {
          setIsVisible(false);
          OK();
        }}
        actionCancel={() => {
          setIsVisible(false);
          CANCEL();
        }}
      />
    </CSSTransition>
  );

  return { confirm, checkConfirm };
};
