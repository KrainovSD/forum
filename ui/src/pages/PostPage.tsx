import { CommentList } from "../models/comment/CommentList";
import { PostCommon } from "../models/post/PostCommon";

export const PostPage: React.FC = () => {
  return (
    <div className="post-page">
      <PostCommon>
        <CommentList />
      </PostCommon>
    </div>
  );
};
