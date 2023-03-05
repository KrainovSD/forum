import "./PostItem.scss";
import thumbtack from "../../../../assets/media/thumbtack.png";
import padlock from "../../../../assets/media/padlock.png";
import { IPostsTypes } from "../../../../store/reducers/post/postTypes";
import { NavLink } from "react-router-dom";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import { LastComment } from "../../../../components/LastComment/LastComment";

interface IPostItemProps {
  post: IPostsTypes;
}

export const PostItem: React.FC<IPostItemProps> = ({ post }) => {
  const postDate = useDateFormat(post.date);
  const countCommentCaption = (value: number) => {
    value = +value;
    if (value > 20) {
      while (value > 20) {
        value = value % 10;
      }
    }
    if (value === 1) return "ответ";
    else if (value >= 2 && value <= 4) return "ответа";
    else return "ответов";
  };
  const viewCountCaption = (value: number) => {
    value = +value;
    if (value > 20) {
      while (value > 20) {
        value = value % 10;
      }
    }
    if (value === 1) return "просмотр";
    else if (value >= 2 && value <= 4) return "просмотра";
    else return "просмотров";
  };

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
          {post.countComment} {countCommentCaption(post.countComment)}
        </h1>
        <p>
          {post.viewCount} {viewCountCaption(post.viewCount)}
        </p>
      </div>
      <LastComment lastComment={post.lastComment} />
    </div>
  );
};
