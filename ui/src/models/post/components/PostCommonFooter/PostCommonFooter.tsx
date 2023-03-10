import "./PostCommonFooter.scss";
import alert from "../../../../assets/media/alert.png";
import arrowLeft from "../../../../assets/media/arrow-left.png";
import { useAppSelector } from "../../../../hooks/redux";
import { NavLink } from "react-router-dom";
import { getAvatar } from "../../../../helpers/getAvatar";

import { AddComment } from "../../../../models/comment/components/AddComment/AddComment";

export const PostCommonFooter: React.FC = () => {
  const { currentPost } = useAppSelector((state) => state.post);
  const { userInfo } = useAppSelector((state) => state.user);
  const avatar = getAvatar(currentPost?.authorAvatar);

  return (
    <div className="post-common-footer">
      {currentPost && currentPost.closed && (
        <div className="post-common-footer__addComment">
          <div className="_avatar">
            <img src={avatar} alt="" />
          </div>
          <div className="_text-field-block _lock">
            <img src={alert} alt="" />
            <p>Эта тема закрыта для публикации ответов.</p>
          </div>
        </div>
      )}
      {userInfo && currentPost && !currentPost.closed && (
        <div className="post-common-footer__addComment">
          <div className="_avatar">
            <img src={avatar} alt="" />
          </div>
          <div className="_text-field-block _open">
            <AddComment />
          </div>
        </div>
      )}

      <div className="post-common-footer__addComment">
        <div className="_avatar">
          <img src={avatar} alt="" />
        </div>
        <div className="_text-field-block _open">
          <AddComment />
        </div>
      </div>

      <div className="post-common-footer__back">
        <NavLink to={`/topic/${currentPost?.topicID}`} className="_back-button">
          <img src={arrowLeft} alt="" />
          <p>ПЕРЕЙТИ К СПИСКУ ТЕМ</p>
        </NavLink>
      </div>
    </div>
  );
};
