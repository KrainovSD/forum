import "./PostCommonFooter.scss";
import arrowLeft from "../../../../assets/media/arrow-left.png";
import { NavLink } from "react-router-dom";
import { IPostTypes } from "store/reducers/post/postTypes";
import { getTopicLink } from "../../../../helpers/getLinks";

interface IPostCommonFooterProps {
  currentPost: IPostTypes;
}

export const PostCommonFooter: React.FC<IPostCommonFooterProps> = ({
  currentPost,
}) => {
  const topicLink = getTopicLink(currentPost.topicID);
  return (
    <div className="post-common-footer">
      <div className="post-common-footer__back">
        <NavLink to={topicLink} className="_back-button">
          <img src={arrowLeft} alt="" />
          <p>ПЕРЕЙТИ К СПИСКУ ТЕМ</p>
        </NavLink>
      </div>
    </div>
  );
};
