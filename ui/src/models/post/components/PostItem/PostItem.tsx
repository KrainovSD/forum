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
import { useAppSelector } from "../../../../hooks/redux";
import { PostAdmitPanel } from "../PostAdminPanel/PostAdminPanel";
import { getDiffInHours } from "../../../../helpers/getDiffInTimes";
import { getPostLink, getUserLink } from "../../../../helpers/getLinks";

interface IPostItemProps {
  post: IPostsTypes;
}

export const PostItem: React.FC<IPostItemProps> = ({ post }) => {
  const { userInfo } = useAppSelector((state) => state.user);
  const postDate = useDateFormat(post.date);
  const userLink = getUserLink(post.authorID);
  const postLink = getPostLink(post.id);

  const conditionToVisibleAdminPanel = () => {
    if (!userInfo) return false;
    if (userInfo.role !== "admin" && userInfo.role !== "moder") {
      const diffInHours = getDiffInHours(post.date);
      if (post.authorID !== userInfo.id) return false;
      else if (userInfo.role === "noob" && post.verified) return false;
      else if (diffInHours > 1 && post.verified) return false;
    }
    return true;
  };

  console.log(post.viewed, post.id);

  return (
    <div className={`post-item ${post.verified ? "" : "_no-verify"}`}>
      <div className="post-item__content">
        <div className="post-item__main-info">
          <div
            className={`post-item__title ${
              userInfo && !post.viewed ? "_unviewed" : ""
            }`}
          >
            {post.closed && <img src={padlock} alt="" />}
            {post.fixed && (
              <div className="post-item__thumbtack">
                <img src={thumbtack} alt="" />
              </div>
            )}
            <NavLink to={postLink}>{post.title}</NavLink>
          </div>
          <p className="post-item__author">
            Автор{" "}
            <NavLink to={userLink} className="_author">
              {post.authorNickName}
            </NavLink>
            , {postDate}
          </p>
        </div>
        <div className="post-item__statistics">
          <h1>
            {post.countComment}{" "}
            {getCountCommentAnswerCaption(post.countComment)}
          </h1>
          <p>
            {post.viewCount} {getViewCountCaption(post.viewCount)}
          </p>
        </div>
        {post.lastComment && <LastComment lastComment={post.lastComment} />}
      </div>
      {conditionToVisibleAdminPanel() && (
        <PostAdmitPanel
          postID={post.id}
          closed={post.closed}
          fixed={post.fixed}
          verified={post.verified}
        />
      )}
    </div>
  );
};
