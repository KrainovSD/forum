import "./PostCommonHeader.scss";
import userAvatar from "../../../../assets/media/user.png";
import thumbtack from "../../../../assets/media/thumbtack.png";
import { useAppSelector } from "../../../../hooks/redux";

import { NavLink } from "react-router-dom";

import { useDateFormat } from "../../../../hooks/useDateFormat";

export const PostCommonHeader: React.FC = () => {
  const { currentPost } = useAppSelector((state) => state.post);

  const avatar = currentPost?.authorAvatar ? "путь к аватару" : userAvatar;
  const dateString = currentPost?.date as string;
  const date = useDateFormat(dateString);

  return (
    <div className="post-common-header">
      <NavLink
        to={`/profile/${currentPost?.authorID}`}
        className="post-common-header__avatar"
      >
        <img src={avatar} alt="" />
      </NavLink>
      <div className="post-common-header__info">
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
          <NavLink to={`/profile/${currentPost?.authorID}`} className="_author">
            {currentPost?.authorNickName}
          </NavLink>
          , {date} в
          <NavLink to={`/topic/${currentPost?.topicID}`} className="_topic">
            {` ${currentPost?.topicTitle}`}
          </NavLink>
        </div>
      </div>
    </div>
  );
};
