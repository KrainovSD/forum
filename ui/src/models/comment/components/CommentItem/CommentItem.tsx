import "./CommentItem.scss";
import userAvatar from "../../../../assets/media/user.png";
import { IComment } from "store/reducers/comment/commentTypes";
import thumbtack from "../../../../assets/media/thumbtack.png";
import { NavLink } from "react-router-dom";
import { getRoleInfo } from "../../../../helpers/getRoleInfo";
import { useDateFormat } from "../../../../hooks/useDateFormat";
interface ICommentItemProps {
  comment: IComment;
}

export const CommentItem: React.FC<ICommentItemProps> = ({ comment }) => {
  const avatar = comment.authorAvatar ? "путь" : userAvatar;
  const [roleString, roleClass] = getRoleInfo(comment.authorRole);
  const date = useDateFormat(comment.date);

  return (
    <div className="comment-item">
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
          <p className="_reputation">Репутация: 860</p>
          <p className="_comment">1901 сообщение</p>
        </div>
        <div className="comment-item__body">
          <div className="_header">
            <div className="_date">Опубликовано {date}</div>
            <div className="_complain" data-tooltip="В разработке">
              Жалоба
            </div>
          </div>
          <div className="_comment">message</div>
        </div>
      </div>
      <div className="comment-item__footer">
        <div className="_reputation">{comment.likes.length}</div>
        <div className="_add-reputation">+</div>
      </div>
    </div>
  );
};
