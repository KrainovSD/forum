import { SmallLoader } from "../../../../components/SmallLoader/SmallLoader";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useCustomSearchParams } from "../../../../hooks/useCustomSearchParams";
import { usePopup } from "../../../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { PageNavBar } from "../../../../models/pageNavBar/PageNavBar";
import { typeSearch } from "../../../../models/pageNavBar/types";
import { PostItem } from "../../../../models/post/components/PostItem/PostItem";
import { useEffect } from "react";
import { getAllPosts } from "../../../../store/reducers/post/postActionCreator";
import "./AdminPanelPostList.scss";
export const AdminPanelPostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading: isLoadingAuth } = useAppSelector((state) => state.auth);
  const { isLoading: isLoadingUser } = useAppSelector((state) => state.user);
  const {
    posts,
    isSmallLoading,
    maxPage,
    statusError,
    updated: updatedPost,
    response,
  } = useAppSelector((state) => state.post);

  const [search, setSearch] = useCustomSearchParams() as typeSearch;
  useEffect(() => {
    const page = search.page ? search.page : "1";
    const filter = search.filter ? search.filter : "no-verify";
    setSearch({ page, filter }, { replace: true });
  }, []);
  useEffect(() => {
    if (statusError === 404 && search.page !== "1")
      setSearch({ page: "1" }, { replace: true });
  }, [statusError]);

  const getPost = () => {
    dispatch(
      getAllPosts({
        page: search.page,
        filter: search.filter,
      })
    );
  };
  useEffect(() => {
    getPost();
  }, [search.page, search.filter]);
  useEffect(() => {
    if (updatedPost) getPost();
  }, [updatedPost]);

  const { popup, setPopup } = usePopup();
  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Посты", response);
  }, [response]);

  const filterOptions = [
    { tag: "last-update", caption: "Последние обновления" },
    { tag: "title", caption: "Заголовок" },
    { tag: "last-date-create", caption: "Дата создания" },
    { tag: "most-view", caption: "Самые просматриваемые" },
    { tag: "most-comment", caption: "Больше ответов" },
    { tag: "no-verify", caption: "Не утвержденные" },
  ];

  return (
    <div className="admin-panel-post-list">
      {popup}
      <PageNavBar
        page={true}
        filter={true}
        maxPage={maxPage}
        filterOptions={filterOptions}
      />
      <div className="post-list__wrapper">
        {!isLoadingAuth && !isLoadingUser && isSmallLoading && <SmallLoader />}
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
      <PageNavBar
        page={true}
        filter={true}
        maxPage={maxPage}
        filterOptions={filterOptions}
      />
    </div>
  );
};
