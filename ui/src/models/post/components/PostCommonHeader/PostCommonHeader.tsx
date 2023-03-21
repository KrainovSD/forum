import "./PostCommonHeader.scss";
import thumbtack from "../../../../assets/media/thumbtack.png";
import message from "../../../../assets/media/message.png";
import { useAppSelector } from "../../../../hooks/redux";
import { NavLink } from "react-router-dom";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import { getAvatar } from "../../../../helpers/getAvatar";
import { IPostTypes } from "store/reducers/post/postTypes";
import {
  getCreatePostLink,
  getTopicLink,
  getUserLink,
} from "../../../../helpers/getLinks";

interface IPostCommonHeaderProps {
  currentPost: IPostTypes;
}

export const PostCommonHeader: React.FC<IPostCommonHeaderProps> = ({
  currentPost,
}) => {
  const { userInfo } = useAppSelector((state) => state.user);

  const avatar = getAvatar(currentPost.authorAvatar, currentPost.authorID);
  const dateString = currentPost.date as string;
  const date = useDateFormat(dateString);
  const topicLink = getTopicLink(currentPost.topicID);
  const userLink = getUserLink(currentPost.authorID);
  const createPostLink = getCreatePostLink(currentPost.topicID);

  return (
    <div>
      <div className="post-common-header">
        <NavLink to={userLink} className="post-common-header__avatar">
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
            <NavLink to={userLink} className="_author">
              {currentPost?.authorNickName}
            </NavLink>
            , {date} в
            <NavLink to={topicLink} className="_topic">
              {` ${currentPost?.topicTitle}`}
            </NavLink>
          </div>
        </div>
      </div>

      {userInfo && (
        <div className="post-common-header__tools">
          <NavLink
            to={createPostLink}
            className="post-common-header__create-new-post"
          >
            Создать новую тему
          </NavLink>
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
