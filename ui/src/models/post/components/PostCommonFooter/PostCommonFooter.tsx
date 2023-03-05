import "./PostCommonFooter.scss";
import userAvatar from "../../../../assets/media/user.png";
import alert from "../../../../assets/media/alert.png";
import arrowLeft from "../../../../assets/media/arrow-left.png";
import { useAppSelector } from "../../../../hooks/redux";
import { NavLink } from "react-router-dom";

export const PostCommonFooter: React.FC = () => {
  const { currentPost } = useAppSelector((state) => state.post);

  return (
    <div className="post-common-footer">
      {currentPost && currentPost.closed && (
        <div className="post-common-footer__addComment">
          <div className="_avatar">
            <img src={userAvatar} alt="" />
          </div>
          <div className="_text-field-block">
            <img src={alert} alt="" />
            <p>Эта тема закрыта для публикации ответов.</p>
          </div>
        </div>
      )}

      <div className="post-common-footer__back">
        <NavLink to={`/topic/${currentPost?.topicID}`} className="_back-button">
          <img src={arrowLeft} alt="" />
          <p>ПЕРЕЙТИ К СПИСКУ ТЕМ</p>
        </NavLink>
      </div>
    </div>
  );
};
