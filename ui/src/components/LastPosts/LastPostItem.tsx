import { getAvatar } from "../../helpers/getAvatar";
import { NavLink } from "react-router-dom";
import { ILastPost } from "store/reducers/post/postTypes";
import "./LastPostItem.scss";
import { useDateFormat } from "../../hooks/useDateFormat";
import { getCountCommentAnswerCaption } from "../../helpers/getCaption";
import { getPostLink, getUserLink } from "../../helpers/getLinks";

interface ILastPostProps {
  post: ILastPost;
}

export const LastPostItem: React.FC<ILastPostProps> = ({ post }) => {
  const avatar = getAvatar(post.authorAvatar, post.authorID);
  const date = useDateFormat(post.postDate);
  const countComentCaption = getCountCommentAnswerCaption(post.countComment);
  const postLink = getPostLink(post.postID);
  const userLink = getUserLink(post.authorID);

  return (
    <div className="last-post-item">
      <NavLink to={userLink} className="last-post-item__avatar">
        <img src={avatar} alt="" />
      </NavLink>
      <div className="last-post-item__info">
        <NavLink to={postLink} className="last-post-item__info-item">
          {post.postTitle}
        </NavLink>
        <NavLink to={userLink} className="last-post-item__info-item">
          От {post.authorNickName}
        </NavLink>
        <div className="last-post-item__info-item _date">Создано {date}</div>
      </div>
      <div
        className="last-post-item__comments"
        data-tooltip={`${post.countComment} ${countComentCaption}`}
      >
        {post.countComment}
      </div>
    </div>
  );
};
