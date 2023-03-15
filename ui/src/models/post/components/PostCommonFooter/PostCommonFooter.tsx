import "./PostCommonFooter.scss";
import arrowLeft from "../../../../assets/media/arrow-left.png";
import { NavLink } from "react-router-dom";
import { IPostTypes } from "store/reducers/post/postTypes";

interface IPostCommonFooterProps {
  currentPost: IPostTypes;
}

export const PostCommonFooter: React.FC<IPostCommonFooterProps> = ({
  currentPost,
}) => {
  return (
    <div className="post-common-footer">
      <div className="post-common-footer__back">
        <NavLink to={`/topic/${currentPost?.topicID}`} className="_back-button">
          <img src={arrowLeft} alt="" />
          <p>ПЕРЕЙТИ К СПИСКУ ТЕМ</p>
        </NavLink>
      </div>
    </div>
  );
};
