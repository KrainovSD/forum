import { Loader } from "../../components/Loader/Loader";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import useFetching from "../../hooks/useFetching";
import { usePopup } from "../../hooks/usePopup";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./MessageList.scss";
import { getMessage } from "../../store/reducers/message/messageActionCreator";
import { useState, useEffect, useRef, UIEventHandler } from "react";
import { useEffectOnlyUpdate } from "../../hooks/useResponse";
import { MessageItem } from "./components/MessageItem/MessageItem";

import { axiosInstanceToken } from "../../helpers/axiosInstanceToken";
import { MessageHeader } from "./components/MessageHeader/MessageHeader";
import { AddMessage } from "./components/AddMessage/AddMessage";
import { UpdateMessage } from "./components/UpdateMessage/UpdateMessage";
import { useIntersect } from "../../hooks/useIntersect";

export interface ICurrentSession {
  sessionID: string;
  otherUsersNickName: string[];
  otherUsersID: string[];
  otherUsersAvatar: string[];
}

export const MessageList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { popup, setPopup } = usePopup();
  const { messages, updated, response, maxPage } = useAppSelector(
    (state) => state.message
  );
  const { id } = useParams();

  /*Управление пагинацией*/
  const [page, setPage] = useState(1);

  const viewport = useRef<HTMLDivElement | null>(null);
  const [intersectItem, setIntersectItem] = useState<HTMLDivElement | null>(
    null
  );
  const refIntersectItem = (el: HTMLDivElement) => {
    if (intersectItem == el || page === maxPage) return;
    setIntersectItem(el);
  };
  const { observed } = useIntersect(viewport.current, intersectItem);
  useEffect(() => {
    if (observed && page < maxPage) setPage(page + 1);
  }, [observed]);

  /* Управление режимами */
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);
  const selectitem = (id: string) => {
    if (multipleSelect.includes(id)) {
      const newSelectArray = multipleSelect.filter((item) => item !== id);
      setMultipleSelect([...newSelectArray]);
    } else setMultipleSelect([...multipleSelect, id]);
  };
  const clearSelect = () => {
    setMultipleSelect([]);
  };
  const [edit, setEdit] = useState({
    commentID: "",
    defaultValue: "",
  });
  const clearEdit = () => {
    setEdit({ defaultValue: "", commentID: "" });
  };
  const fillEdit = (id: string, value: string) => {
    setEdit({ commentID: id, defaultValue: value });
  };

  /* Получение и обработка данных */
  const [sessionInfo, setSessionInfo] = useState<ICurrentSession | null>(null);
  const getSessionInfo = async () => {
    const response = await axiosInstanceToken.get<ICurrentSession>(
      `/api/message/session/${id}`
    );
    setSessionInfo(response.data);
    if (id) dispatch(getMessage({ sessionID: id, page: `${page}` }));
  };
  const { fetching, isLoading } = useFetching(
    getSessionInfo,
    setPopup,
    "Сообщения",
    () => {
      navigate(`/message`);
    }
  );

  useEffect(() => {
    if (id) fetching();
  }, []);
  useEffectOnlyUpdate(() => {
    if (id) dispatch(getMessage({ sessionID: id, page: `${page}` }));
  }, [page]);
  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Сообщения", response);
  }, [response]);
  useEffectOnlyUpdate(() => {
    if (updated && id) dispatch(getMessage({ sessionID: id, page: `${page}` }));
  }, [updated]);

  return (
    <div className="message-list">
      {popup}
      {isLoading && <Loader />}
      {sessionInfo && (
        <MessageHeader
          sessionInfo={sessionInfo}
          clearSelect={clearSelect}
          multipleSelect={multipleSelect}
        />
      )}
      {messages.length > 0 && (
        <div className="message-list__content" ref={viewport}>
          {messages.map((message, index) => (
            <div key={message.id}>
              <MessageItem
                message={message}
                multipleSelect={multipleSelect}
                selectItem={selectitem}
                editID={edit.commentID}
                fillEdit={fillEdit}
              />
              {messages.length - 2 === index && (
                <div
                  className="_detect"
                  ref={refIntersectItem}
                  onClick={() => {
                    console.log("all");
                    setPage(page + 1);
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      )}
      {sessionInfo && edit.commentID.length === 0 && (
        <AddMessage defaultMembers={sessionInfo.otherUsersID} />
      )}
      {sessionInfo && edit.commentID.length > 0 && (
        <UpdateMessage
          defaultValue={edit.defaultValue}
          messageID={edit.commentID}
          clearEdit={clearEdit}
        />
      )}
    </div>
  );
};
