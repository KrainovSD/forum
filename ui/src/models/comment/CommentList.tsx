import { useParams } from "react-router-dom";
import { getCommentByPostID } from "../../store/reducers/comment/commentCreateAction";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import "./CommentList.scss";
import { CommentItem } from "./components/CommentItem/CommentItem";
import { useEffect } from "react";
import { useCustomSearchParams } from "../../hooks/useCustomSearchParams";
import { ICommentSearch } from "./types/CommentTypes";

export const CommentList: React.FC = () => {
  const { comments } = useAppSelector((state) => state.comment);
  const [search, setSearch] = useCustomSearchParams() as ICommentSearch;
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const page = search.page ? search.page : "1";
    setSearch({ page }, { replace: true });
  }, [id]);

  useEffect(() => {
    if (id && search.page)
      dispatch(getCommentByPostID({ id, page: search.page }));
  }, [id, search.page]);

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </div>
  );
};
