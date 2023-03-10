import { useParams } from "react-router-dom";
import { getCommentByPostID } from "../../store/reducers/comment/commentCreateAction";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import "./CommentList.scss";
import { CommentItem } from "./components/CommentItem/CommentItem";
import { useEffect } from "react";
import { useCustomSearchParams } from "../../hooks/useCustomSearchParams";
import { ICommentSearch } from "./types/CommentTypes";
import { PageNavBar } from "../../models/pageNavBar/PageNavBar";
import { SmallLoader } from "../../components/SmallLoader/SmallLoader";

export const CommentList: React.FC = () => {
  const { isLoading: isLoadingAuth } = useAppSelector((state) => state.auth);
  const { isLoading: isLoadingUser } = useAppSelector((state) => state.user);
  const {
    comments,
    maxPage,
    isSmallLoading,
    updated: updatedComment,
  } = useAppSelector((state) => state.comment);
  const { updated: updatedLike } = useAppSelector((state) => state.like);
  const [search, setSearch] = useCustomSearchParams() as ICommentSearch;
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const page = search.page ? search.page : "1";
    setSearch({ page }, { replace: true });
  }, [id]);

  const getComments = () => {
    if (id && search.page)
      dispatch(getCommentByPostID({ id, page: search.page }));
  };

  useEffect(() => {
    getComments();
  }, [id, search.page]);
  useEffect(() => {
    if (updatedLike) getComments();
  }, [updatedLike]);
  useEffect(() => {
    if (updatedComment) getComments();
  }, [updatedComment]);

  return (
    <div className="comment-list">
      {!isLoadingAuth && !isLoadingUser && isSmallLoading && <SmallLoader />}
      <PageNavBar page={true} maxPage={maxPage} />

      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}

      <PageNavBar page={true} maxPage={maxPage} />
    </div>
  );
};
