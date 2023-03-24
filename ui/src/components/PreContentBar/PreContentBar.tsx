import { NavLink, useLocation, useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import "./PreContentBar.scss";
import {
  useLazyGetPostParentsQuery,
  useLazyGetTopicParentsQuery,
} from "../../store/RTK Query/navContentBar/navContentBarSlice";

interface IContentItem {
  title: string;
  navigate: string;
}
export interface IParentInfo {
  topicInfo: ITopicInfo[];
  postTitle: string | null;
}

interface ITopicInfo {
  topicID: string | number;
  topicTitle: string;
}

export const PreContentBar: React.FC = () => {
  const isInt = (str: string) => str?.length !== 0 && Number.isFinite(+str);

  const location = useLocation();
  const path = location.pathname.split("/").splice(1)[0];
  const id = isInt(location.pathname.split("/").splice(1)[1])
    ? location.pathname.split("/").splice(1)[1]
    : null;

  const [contentItem, setContentItem] = useState<IContentItem[]>([]);
  const fillContentItem = () => {
    if (!path) setContentItem([]);
    switch (path) {
      case "confirm": {
        const contentItem = {
          title: "Подтверждение аккаунта",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "password": {
        const contentItem = {
          title: "Смена пароля",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "email": {
        const contentItem = {
          title: "Смена почты",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "login": {
        const contentItem = {
          title: "Вход в систему",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "register": {
        const contentItem = {
          title: "Регистрация",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "forgot": {
        const contentItem = {
          title: "Забыли пароль",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "profile": {
        const contentItem = {
          title: "Профиль",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "message": {
        const contentItem = {
          title: "Сообщения",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "setting": {
        const contentItem = {
          title: "Настройки",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "admin-panel": {
        const contentItem = {
          title: "Панель администратора",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "create": {
        const contentItem = {
          title: "Создание контента",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "update": {
        const contentItem = {
          title: "Обновление контента",
          navigate: "",
        };
        setContentItem([contentItem]);
        return;
      }
      case "topic": {
        findTopicContentItem();
        break;
      }
      case "post": {
        findPostContentItem();
        break;
      }
      default: {
        setContentItem([]);
        return;
      }
    }
  };

  const [triggerPostParent, resultPostParent] = useLazyGetPostParentsQuery();
  const [triggerTopicParent, resultTopicParent] = useLazyGetTopicParentsQuery();
  const findTopicContentItem = () => {
    if (id) triggerTopicParent(id, true);
  };
  const findPostContentItem = () => {
    if (id) triggerPostParent(id, true);
  };

  const setTopicItems = () => {
    const topicInfo = resultTopicParent.data?.topicInfo;
    console.log(resultTopicParent.data);
    if (!topicInfo) return;
    const newContentItems = [];
    for (const topic of topicInfo) {
      const newContentItem = {
        title: topic.topicTitle,
        navigate: `/topic/${topic.topicID}`,
      };
      newContentItems.push(newContentItem);
    }
    setContentItem([...newContentItems]);
  };
  const setPostItems = () => {
    const topicInfo = resultPostParent.data?.topicInfo;
    const postInfo = resultPostParent.data?.postTitle;
    if (!topicInfo || !postInfo) return;
    const newContentItems = [];
    for (const topic of topicInfo) {
      const newContentItem = {
        title: topic.topicTitle,
        navigate: `/topic/${topic.topicID}`,
      };
      newContentItems.push(newContentItem);
    }
    newContentItems.push({ title: postInfo, navigate: "" });
    setContentItem([...newContentItems]);
  };

  useEffect(() => {
    fillContentItem();
  }, [path, id]);
  useEffect(() => {
    if (path === "topic") setTopicItems();
    if (path === "post") setPostItems();
  }, [path, id, resultPostParent.data, resultTopicParent.data]);

  return (
    <div className="pre-content-bar__wrapper">
      <div className="pre-content-bar">
        <div>
          <NavLink to={`/`} className="pre-content-bar__item">
            Главная
          </NavLink>
        </div>

        {contentItem.map((item) => (
          <div key={item.title}>
            {item.navigate.length === 0 && (
              <div className="pre-content-bar__item">{item.title}</div>
            )}
            {item.navigate.length > 0 && (
              <NavLink to={item.navigate} className="pre-content-bar__item">
                {item.title}
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
