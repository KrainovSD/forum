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
import { useConfirm } from "../../../../hooks/useConfirm";
import { UpdateComment } from "../UpdateComment/UpdateComment";
import { DeleteComment } from "../DeleteComment/DeleteComment";
import { CommentAdminPanel } from "../CommentAdminPanel/CommentAdminPanel";
interface ICommentItemProps {
  comment: IComment;
}

export const CommentItem: React.FC<ICommentItemProps> = ({ comment }) => {
  const avatar = getAvatar(comment.authorAvatar, comment.authorID);
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

  const conditionToUpdate =
    (userInfo && userInfo.id === comment.authorID && timePassed <= 24) ||
    (userInfo && (userInfo.role === "admin" || userInfo.role == "moder"));
  const conditionToDelete =
    (userInfo &&
      userInfo.id === comment.authorID &&
      (timePassed <= 1 || !comment.verified)) ||
    (userInfo && (userInfo.role === "admin" || userInfo.role == "moder"));

  const [isVisibleCommentUpdate, setIsVisibleCommentUpdate] = useState(false);
  const { checkConfirm: checkCancelUpdate, confirm: confirmCancelUpdate } =
    useConfirm(() => {
      setIsVisibleCommentUpdate(false);
    });
  const toggleUpdate = () => {
    if (isVisibleCommentUpdate)
      return checkCancelUpdate(
        "Закрыть редактор",
        "Не сохраненные изменения будут сброшены! Вы уверены что хотите закрыть редактор?"
      );
    return setIsVisibleCommentUpdate(true);
  };

  return (
    <div className="comment-item" id={`${comment.id}`}>
      {!comment.verified && !isVisibleCommentUpdate && (
        <div className="comment-item__no-verify"></div>
      )}
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
      {confirmCancelUpdate}

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
          {!isVisibleCommentUpdate && (
            <div className="_content">
              <div className="_comment">{comment.body}</div>
              {comment.updated && (
                <div className="_update">
                  Изменено {dateUpdate} пользователем{" "}
                  {comment.authorUpdateNickName}
                </div>
              )}
            </div>
          )}
          {isVisibleCommentUpdate && (
            <div className="_update-comment">
              <UpdateComment
                commentBody={comment.body}
                commentID={comment.id}
                close={() => {
                  setIsVisibleCommentUpdate(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="comment-item__footer">
        {conditionToDelete && !comment.main && (
          <DeleteComment commentID={comment.id} />
        )}
        {conditionToUpdate && !isVisibleCommentUpdate && (
          <div className="_change" onClick={toggleUpdate}>
            Изменить
          </div>
        )}
        {isVisibleCommentUpdate && (
          <div className="_change" onClick={toggleUpdate}>
            Отменить
          </div>
        )}

        {userInfo && (userInfo.role == "admin" || userInfo.role == "moder") && (
          <CommentAdminPanel
            commentID={comment.id}
            verified={comment.verified}
            fixed={comment.fixed}
          />
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
