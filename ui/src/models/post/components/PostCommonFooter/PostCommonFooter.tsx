import "./PostCommonFooter.scss";
import alert from "../../../../assets/media/alert.png";
import arrowLeft from "../../../../assets/media/arrow-left.png";
import { useAppSelector } from "../../../../hooks/redux";
import { NavLink } from "react-router-dom";
import { getAvatar } from "../../../../helpers/getAvatar";

import { AddComment } from "../../../../models/comment/components/AddComment/AddComment";
import { IPostTypes } from "store/reducers/post/postTypes";

interface IPostCommonFooterProps {
  currentPost: IPostTypes;
}

export const PostCommonFooter: React.FC<IPostCommonFooterProps> = ({
  currentPost,
}) => {
  const { userInfo } = useAppSelector((state) => state.user);

  const avatar = getAvatar(userInfo?.avatar, userInfo?.id as string);

  return (
    <div className="post-common-footer">
      <div className="post-common-footer__addComment">
        <div className="_avatar">
          <img src={avatar} alt="" />
        </div>
        <div
          className={`_text-field-block ${
            currentPost.closed ? "_lock" : "_open"
          }`}
        >
          {!currentPost.closed && <AddComment />}
          {currentPost.closed && (
            <div>
              <img src={alert} alt="" />
              <p>Эта тема закрыта для публикации ответов.</p>
            </div>
          )}
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
