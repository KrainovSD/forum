import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect, useState } from "react";
import "./SessionList.scss";
import { getSession } from "../../store/reducers/message/messageActionCreator";
import { SessionItem } from "./components/SessionItem/SessionItem";
import { useEffectOnlyUpdate } from "../../hooks/useResponse";
import { usePopup } from "../../hooks/usePopup";
import { BlackButton } from "../../components/UI/BlackButton/BlackButton";
import { AddSession } from "./components/AddSession/AddSession";
import { Animation } from "../../components/Animation/Animation";
export const SessionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { updated, response, sessions } = useAppSelector(
    (state) => state.message
  );
  useEffect(() => {
    dispatch(getSession());
  }, []);

  const { popup, setPopup } = usePopup();
  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Сообщения", response);
  }, [response]);
  useEffectOnlyUpdate(() => {
    if (updated) dispatch(getSession());
  }, [updated]);

  const [isVisibleAddSession, setIsVisibleAddSession] = useState(false);

  return (
    <div className="session-list">
      {popup}
      <Animation className="appear-anim" isVisible={isVisibleAddSession}>
        <AddSession
          close={() => {
            setIsVisibleAddSession(false);
          }}
        />
      </Animation>

      <div className="session-list__button-wrapper">
        <BlackButton
          onClick={() => {
            setIsVisibleAddSession(true);
          }}
        >
          Написать сообщение
        </BlackButton>
      </div>

      <div className="session-list__wrapper">
        {sessions.map((session) => (
          <SessionItem key={session.sessionID} session={session} />
        ))}
      </div>
    </div>
  );
};
