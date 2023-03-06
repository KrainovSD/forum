import "./CommentItem.scss";

import { IComment } from "store/reducers/comment/commentTypes";
import thumbtack from "../../../../assets/media/thumbtack.png";
import { NavLink } from "react-router-dom";
import { getRoleInfo } from "../../../../helpers/getRoleInfo";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import { getCountCommentMessageCaption } from "../../../../helpers/getCaption";
import { getAvatar } from "../../../../helpers/getAvatar";
import { useAppSelector } from "../../../../hooks/redux";
interface ICommentItemProps {
  comment: IComment;
}

export const CommentItem: React.FC<ICommentItemProps> = ({ comment }) => {
  const avatar = getAvatar(comment.authorAvatar);
  const { roleString, roleClass } = getRoleInfo(comment.authorRole);
  const date = useDateFormat(comment.date);
  const dateUpdate = useDateFormat(comment.dateUpdate || "");

  const { userInfo } = useAppSelector((state) => state.user);

  return (
    <div className="comment-item" id={`${comment.id}`}>
      <div className="comment-item__content">
        <div className="comment-item__user-info">
          <div className="_header">
            {comment.fixed && (
              <div className="_thumbtack">
                <img src={thumbtack} alt="" />
              </div>
            )}
            <NavLink to={`/profile/${comment.authorID}`} className="_nick">
              {comment.authorNickName}
            </NavLink>
          </div>
          <div className="_avatar">
            <img src={avatar} alt="" />
          </div>
          <p className={`_role ${roleClass}`}>{roleString}</p>
          <p className="_reputation">Репутация: {comment.authorReputation}</p>
          <p className="_comment">
            {comment.authorCountComment}{" "}
            {getCountCommentMessageCaption(comment.authorCountComment)}
          </p>
        </div>
        <div className="comment-item__body">
          <div className="_header">
            <div className="_date">
              Опубликовано {date} {comment.updated && `(изменено)`}
            </div>
            <div className="_complain" data-tooltip="В разработке">
              Жалоба
            </div>
          </div>
          <div className="_comment">{comment.body}</div>
          {comment.updated && (
            <div className="_update">
              Изменено {dateUpdate} пользователем {comment.authorUpdateNickName}
            </div>
          )}
        </div>
      </div>
      <div className="comment-item__footer">
        <div className="_reputation">{comment.likes.length}</div>
        {userInfo &&
          userInfo.id !== comment.authorID &&
          !comment.likes.includes(userInfo.id) && (
            <div className="_add-reputation">+</div>
          )}
        {userInfo &&
          userInfo.id !== comment.authorID &&
          comment.likes.includes(userInfo.id) && (
            <div className="_remove-reputation">-</div>
          )}
      </div>
    </div>
  );
};
