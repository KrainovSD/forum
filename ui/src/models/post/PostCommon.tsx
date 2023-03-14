import { PropsWithChildren } from "react";
import { PostCommonFooter } from "./components/PostCommonFooter/PostCommonFooter";
import { PostCommonHeader } from "./components/PostCommonHeader/PostCommonHeader";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getPostByID } from "../../store/reducers/post/postActionCreator";
import { useParams } from "react-router-dom";

export const PostCommon: React.FC<PropsWithChildren> = ({ children }) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { currentPost } = useAppSelector((state) => state.post);
  useEffect(() => {
    if (id) {
      dispatch(getPostByID(id));
    }
  }, []);

  return (
    <div className="post-common">
      {currentPost && <PostCommonHeader currentPost={currentPost} />}
      <div className="post-common__comment-list">{children}</div>
      {currentPost && <PostCommonFooter currentPost={currentPost} />}
    </div>
  );
};
