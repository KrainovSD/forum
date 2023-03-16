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
import { CommentListFooter } from "./components/CommentListFooter/CommentListFooter";
import { usePopup } from "../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../hooks/useResponse";

export const CommentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading: isLoadingAuth } = useAppSelector((state) => state.auth);
  const { isLoading: isLoadingUser, userInfo } = useAppSelector(
    (state) => state.user
  );
  const { updated: updatedLike } = useAppSelector((state) => state.like);
  const {
    comments,
    maxPage,
    isSmallLoading,
    updated: updatedComment,
    response,
    statusError,
  } = useAppSelector((state) => state.comment);

  const [search, setSearch] = useCustomSearchParams() as ICommentSearch;
  const { id: postID } = useParams();

  useEffect(() => {
    const page = search.page ? search.page : "1";
    setSearch({ page }, { replace: true });
  }, [postID]);
  useEffect(() => {
    if (statusError === 404 && search.page !== "1")
      setSearch({ page: "1" }, { replace: true });
  }, [statusError]);

  const getComments = () => {
    if (postID && search.page)
      dispatch(getCommentByPostID({ id: postID, page: search.page }));
  };
  useEffect(() => {
    getComments();
  }, [postID, search.page]);
  useEffect(() => {
    if (updatedLike) getComments();
  }, [updatedLike]);
  useEffect(() => {
    if (updatedComment) getComments();
  }, [updatedComment]);

  const { popup, setPopup } = usePopup();
  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Комментарии", response);
  }, [response]);

  return (
    <div className="comment-list">
      {popup}
      {!isLoadingAuth && !isLoadingUser && isSmallLoading && <SmallLoader />}
      <PageNavBar page={true} maxPage={maxPage} />
      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
      <PageNavBar page={true} maxPage={maxPage} />
      {userInfo && postID && (
        <CommentListFooter userInfo={userInfo} postID={postID} />
      )}
    </div>
  );
};
