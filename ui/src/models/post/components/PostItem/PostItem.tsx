import "./PostItem.scss";
import thumbtack from "../../../../assets/media/thumbtack.png";
import padlock from "../../../../assets/media/padlock.png";
import { IPostsTypes } from "../../../../store/reducers/post/postTypes";
import { NavLink } from "react-router-dom";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import { LastComment } from "../../../../components/LastComment/LastComment";
import {
  getCountCommentAnswerCaption,
  getViewCountCaption,
} from "../../../../helpers/getCaption";

interface IPostItemProps {
  post: IPostsTypes;
}

export const PostItem: React.FC<IPostItemProps> = ({ post }) => {
  const postDate = useDateFormat(post.date);

  return (
    <div className="post-item">
      <div className="post-item__main-info">
        <div className="post-item__title">
          {post.closed && <img src={padlock} alt="" />}
          {post.fixed && (
            <div className="post-item__thumbtack">
              <img src={thumbtack} alt="" />
            </div>
          )}
          <NavLink to={`/post/${post.id}`}>{post.title}</NavLink>
        </div>
        <p className="post-item__author">
          Автор{" "}
          <NavLink to={`/profle/${post.authorID}`} className="_author">
            {post.authorNickName}
          </NavLink>
          , {postDate}
        </p>
      </div>
      <div className="post-item__statistics">
        <h1>
          {post.countComment} {getCountCommentAnswerCaption(post.countComment)}
        </h1>
        <p>
          {post.viewCount} {getViewCountCaption(post.viewCount)}
        </p>
      </div>
      {post.lastComment && <LastComment lastComment={post.lastComment} />}
    </div>
  );
};
