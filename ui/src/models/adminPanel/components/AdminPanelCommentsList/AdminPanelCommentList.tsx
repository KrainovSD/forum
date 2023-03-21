import { SmallLoader } from "../../../../components/SmallLoader/SmallLoader";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useCustomSearchParams } from "../../../../hooks/useCustomSearchParams";
import { usePopup } from "../../../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { CommentItem } from "../../../../models/comment/components/CommentItem/CommentItem";
import { PageNavBar } from "../../../../models/pageNavBar/PageNavBar";
import { typeSearch } from "../../../../models/pageNavBar/types";
import { useEffect } from "react";
import { getAllComments } from "../../../../store/reducers/comment/commentCreateAction";
import "./AdminPanelCommentList.scss";

export const AdminPanelCommentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading: isLoadingAuth } = useAppSelector((state) => state.auth);
  const { isLoading: isLoadingUser } = useAppSelector((state) => state.user);
  const { updated: updatedLike } = useAppSelector((state) => state.like);
  const {
    comments,
    maxPage,
    isSmallLoading,
    updated: updatedComment,
    response,
    statusError,
  } = useAppSelector((state) => state.comment);

  const [search, setSearch] = useCustomSearchParams() as typeSearch;

  useEffect(() => {
    const page = search.page ? search.page : "1";
    const filter = search.filter ? search.filter : "last-date-create";
    setSearch({ page, filter }, { replace: true });
  }, [search.page, search.filter]);
  useEffect(() => {
    if (statusError === 404 && search.page !== "1")
      setSearch({ page: "1" }, { replace: true });
  }, [statusError]);

  const getComments = () => {
    if (search.page)
      dispatch(
        getAllComments({
          page: search.page,
          filter: search.filter ? search.filter : "last-date-create",
        })
      );
  };
  useEffect(() => {
    getComments();
  }, [search.page, search.filter]);
  useEffectOnlyUpdate(() => {
    if (updatedLike) getComments();
  }, [updatedLike]);
  useEffectOnlyUpdate(() => {
    if (updatedComment) getComments();
  }, [updatedComment]);

  const { popup, setPopup } = usePopup();
  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Комментарии", response);
  }, [response]);

  const filterOptions = [
    { tag: "last-update", caption: "Последние обновления" },
    { tag: "last-date-create", caption: "Дата создания" },
    { tag: "most-likes", caption: "Самые популярные" },
    { tag: "no-verify", caption: "Не утвержденные" },
  ];

  return (
    <div className="admin-panel-comment-list">
      {popup}
      {!isLoadingAuth && !isLoadingUser && isSmallLoading && <SmallLoader />}

      {search.page && (
        <PageNavBar
          page={true}
          maxPage={maxPage}
          filter={true}
          filterOptions={filterOptions}
        />
      )}
      {comments.length === 0 && (
        <div className="not-found">Комментарии не найдены</div>
      )}
      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}

      {search.page && (
        <PageNavBar
          page={true}
          maxPage={maxPage}
          filter={true}
          filterOptions={filterOptions}
        />
      )}
    </div>
  );
};
