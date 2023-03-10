import "./PostCommonHeader.scss";
import thumbtack from "../../../../assets/media/thumbtack.png";
import message from "../../../../assets/media/message.png";
import { useAppSelector } from "../../../../hooks/redux";

import { NavLink } from "react-router-dom";

import { useDateFormat } from "../../../../hooks/useDateFormat";
import { getAvatar } from "../../../../helpers/getAvatar";

export const PostCommonHeader: React.FC = () => {
  const { currentPost } = useAppSelector((state) => state.post);
  const { userInfo } = useAppSelector((state) => state.user);

  const avatar = getAvatar(currentPost?.authorAvatar);
  const dateString = currentPost?.date as string;
  const date = useDateFormat(dateString);

  return (
    <div>
      <div className="post-common-header">
        <NavLink
          to={`/profile/${currentPost?.authorID}`}
          className="post-common-header__avatar"
        >
          <img src={avatar} alt="" />
        </NavLink>
        <div className="post-common-header__info-wrapper">
          <div className="post-common-header__title">
            {currentPost && currentPost.fixed && (
              <div className="_thumbtack" data-tooltip="Закреплено">
                <img src={thumbtack} alt="" />
              </div>
            )}
            <p>{currentPost?.title}</p>
          </div>
          <div className="post-common-header__author">
            Автор{" "}
            <NavLink
              to={`/profile/${currentPost?.authorID}`}
              className="_author"
            >
              {currentPost?.authorNickName}
            </NavLink>
            , {date} в
            <NavLink to={`/topic/${currentPost?.topicID}`} className="_topic">
              {` ${currentPost?.topicTitle}`}
            </NavLink>
          </div>
        </div>
      </div>

      {userInfo && (
        <div className="post-common-header__tools">
          <div className="post-common-header__create-new-post">
            Создать новую тему
          </div>
          {!currentPost?.closed && (
            <a href="#comment" className="post-common-header__new-comment">
              <img src={message} alt="" /> Ответить
            </a>
          )}
        </div>
      )}
    </div>
  );
};
