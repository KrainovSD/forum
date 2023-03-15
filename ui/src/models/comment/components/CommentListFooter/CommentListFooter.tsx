import "./CommentListFooter.scss";
import { AddComment } from "../../../../models/comment/components/AddComment/AddComment";
import alert from "../../../../assets/media/alert.png";
import { getAvatar } from "../../../../helpers/getAvatar";
import { useAppSelector } from "../../../../hooks/redux";
import { IUserInfo } from "store/reducers/user/userTypes";

interface ICommentListFooterProps {
  userInfo: IUserInfo;
  postID: string;
}

export const CommentListFooter: React.FC<ICommentListFooterProps> = ({
  userInfo,
  postID,
}) => {
  const { currentPost } = useAppSelector((state) => state.post);
  const avatar = getAvatar(userInfo.avatar, userInfo.id);

  if (!currentPost) return <div></div>;
  return (
    <div className="comment-list-footer__addComment" id="comment">
      <div className="_avatar">
        <img src={avatar} alt="" />
      </div>
      <div
        className={`_text-field-block ${
          currentPost.closed ? "_lock" : "_open"
        }`}
      >
        {!currentPost.closed && postID && (
          <AddComment main={false} postID={postID} />
        )}
        {currentPost.closed && (
          <div>
            <img src={alert} alt="" />
            <p>Эта тема закрыта для публикации ответов.</p>
          </div>
        )}
      </div>
    </div>
  );
};
