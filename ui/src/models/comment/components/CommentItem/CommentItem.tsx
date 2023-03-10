import "./CommentItem.scss";

import { IComment } from "store/reducers/comment/commentTypes";
import thumbtack from "../../../../assets/media/thumbtack.png";
import { NavLink } from "react-router-dom";
import { getRoleInfo } from "../../../../helpers/getRoleInfo";
import { useDateFormat } from "../../../../hooks/useDateFormat";
import { getCountCommentMessageCaption } from "../../../../helpers/getCaption";
import { getAvatar } from "../../../../helpers/getAvatar";
import { useAppSelector } from "../../../../hooks/redux";
import { useState } from "react";
import { LikesPopup } from "../../../likes/LikesPopup";
import { CSSTransition } from "react-transition-group";
import { AddLike } from "../../../../models/likes/components/AddLike/AddLike";
import { DeleteLike } from "../../../../models/likes/components/DeleteLike/DeleteLike";
import { getDiffInHours } from "../../../../helpers/getDiffInHours";
interface ICommentItemProps {
  comment: IComment;
}

export const CommentItem: React.FC<ICommentItemProps> = ({ comment }) => {
  const avatar = getAvatar(comment.authorAvatar);
  const { roleString, roleClass } = getRoleInfo(comment.authorRole);
  const date = useDateFormat(comment.date);
  const dateUpdate = useDateFormat(comment.dateUpdate || "");
  const timePassed = getDiffInHours(comment.date);

  const { userInfo } = useAppSelector((state) => state.user);

  const [isVisibleLikes, setIsVisibleLikes] = useState<boolean>(false);
  const showLikes = () => {
    if (comment.likes.length === 0) return;
    const visible = isVisibleLikes ? false : true;
    setIsVisibleLikes(visible);
  };

  return (
    <div className="comment-item" id={`${comment.id}`}>
      {!comment.verified && <div className="comment-item__no-verify"></div>}
      <CSSTransition
        in={isVisibleLikes}
        timeout={300}
        classNames="appear-anim"
        unmountOnExit
      >
        <LikesPopup
          commentID={comment.id}
          closePopup={() => {
            setIsVisibleLikes(false);
          }}
        />
      </CSSTransition>

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
            {userInfo && userInfo.id !== comment.authorID && (
              <div className="_complain" data-tooltip="В разработке">
                Жалоба
              </div>
            )}
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
        {userInfo &&
          userInfo.id === comment.authorID &&
          (timePassed <= 1 || !comment.verified) && (
            <div className="_delete">Удалить</div>
          )}
        {userInfo && userInfo.id === comment.authorID && timePassed <= 24 && (
          <div className="_change">Изменить</div>
        )}
        <div className="_reputation" onClick={showLikes}>
          {comment.likes.length}
        </div>
        {userInfo &&
          userInfo.id !== comment.authorID &&
          !comment.likes.includes(userInfo.id) && (
            <AddLike
              authorCommentID={comment.authorID}
              commentID={comment.id}
            />
          )}
        {userInfo &&
          userInfo.id !== comment.authorID &&
          comment.likes.includes(userInfo.id) && (
            <DeleteLike commentID={comment.id} />
          )}
      </div>
    </div>
  );
};
