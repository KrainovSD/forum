import { Confirm } from "../components/Confirm/Confirm";
import { CSSTransition } from "react-transition-group";
import { useState } from "react";

type IuseConfirm = (
  OK?: () => void,
  CANCEL?: () => void
) => { confirm: JSX.Element; checkConfirm: IcheckConfirm };
type IcheckConfirm = (
  title: string,
  body: string,
  newOk?: (() => void) | null,
  newCancel?: (() => void) | null
) => void;

export const useConfirm: IuseConfirm = (OK = () => {}, CANCEL = () => {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [callbackOK, setCallbackOk] = useState(() => OK);
  const [callbackCancel, setCallbackCancel] = useState(() => CANCEL);

  const checkConfirm: IcheckConfirm = async (
    title,
    body,
    newOK = null,
    newCancel = null
  ) => {
    setIsVisible(true);
    setTitle(title);
    setBody(body);
    if (newOK) setCallbackOk(() => newOK);
    else if (!newOK) setCallbackOk(() => OK);
    if (newCancel) setCallbackCancel(() => newCancel);
    else if (!newCancel) setCallbackCancel(() => CANCEL);
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
          callbackOK();
        }}
        actionCancel={() => {
          setIsVisible(false);
          callbackCancel();
        }}
      />
    </CSSTransition>
  );

  return { confirm, checkConfirm };
};
