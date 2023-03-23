import { SmallLoader } from "../../../../components/SmallLoader/SmallLoader";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useCustomSearchParams } from "../../../../hooks/useCustomSearchParams";
import { usePopup } from "../../../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { PageNavBar } from "../../../../models/pageNavBar/PageNavBar";
import { typeSearch } from "../../../../models/pageNavBar/types";
import { PostItem } from "../../../../models/post/components/PostItem/PostItem";
import { useEffect } from "react";
import "./UserPostList.scss";
import { getPostByUserID } from "../../../../store/reducers/post/postActionCreator";
import { useParams } from "react-router-dom";

export const UserPostList: React.FC = () => {
  const { id: userID } = useParams();
  const dispatch = useAppDispatch();
  const { isLoading: isLoadingAuth } = useAppSelector((state) => state.auth);
  const { isLoading: isLoadingUser, userInfo } = useAppSelector(
    (state) => state.user
  );
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
    const filter = search.filter ? search.filter : "last-date-create";
    setSearch({ page, filter }, { replace: true });
  }, []);
  useEffect(() => {
    if (statusError === 404 && search.page !== "1")
      setSearch({ page: "1" }, { replace: true });
  }, [statusError]);

  const getPost = () => {
    if (userID && search.page)
      dispatch(
        getPostByUserID({
          page: search.page,
          filter: search.filter ? search.filter : "last-date-create",
          userID: userID,
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

  const filterOptions =
    userInfo &&
    (userInfo.id === userID ||
      userInfo.role === "moder" ||
      userInfo.role === "admin")
      ? [
          { tag: "last-update", caption: "Последние обновления" },
          { tag: "title", caption: "Заголовок" },
          { tag: "last-date-create", caption: "Дата создания" },
          { tag: "most-view", caption: "Самые просматриваемые" },
          { tag: "most-comment", caption: "Больше ответов" },
          { tag: "no-verify", caption: "Не утвержденные" },
        ]
      : [
          { tag: "last-update", caption: "Последние обновления" },
          { tag: "title", caption: "Заголовок" },
          { tag: "last-date-create", caption: "Дата создания" },
          { tag: "most-view", caption: "Самые просматриваемые" },
          { tag: "most-comment", caption: "Больше ответов" },
        ];

  console.log(posts);
  return (
    <div className="user-post-list">
      {popup}
      <PageNavBar
        page={true}
        filter={true}
        maxPage={maxPage}
        filterOptions={filterOptions}
      />
      <div className="post-list__wrapper">
        {!isLoadingAuth && !isLoadingUser && isSmallLoading && <SmallLoader />}
        {posts.length === 0 && <div className="not-found">Темы не найдены</div>}
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
