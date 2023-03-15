import { PostItem } from "./components/PostItem/PostItem";
import messageWhite from "./../../assets/media/comment-white.png";
import "./PostList.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect } from "react";
import { getPostByTopicID } from "../../store/reducers/post/postActionCreator";
import { SmallLoader } from "../../components/SmallLoader/SmallLoader";
import { useCustomSearchParams } from "../../hooks/useCustomSearchParams";
import { NavLink, useParams } from "react-router-dom";
import { PageNavBar } from "../../models/pageNavBar/PageNavBar";
import { typeSearch } from "../../models/pageNavBar/types";
import { usePopup } from "../../hooks/usePopup";

export const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { parentInfo: topicParentInfo } = useAppSelector(
    (state) => state.topic
  );
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
  const { id: topicID } = useParams();
  useEffect(() => {
    const page = search.page ? search.page : "1";
    const filter = search.filter ? search.filter : "last-date-create";
    setSearch({ page, filter }, { replace: true });
  }, [topicID]);
  useEffect(() => {
    if (statusError === 404 && search.page !== "1")
      setSearch({ page: "1" }, { replace: true });
  }, [statusError]);

  const getPost = () => {
    if (topicID && (search.page || search.filter))
      dispatch(
        getPostByTopicID({
          page: search.page,
          filter: search.filter,
          topicID: +topicID,
        })
      );
  };
  useEffect(() => {
    getPost();
  }, [search.page, search.filter, topicID]);
  useEffect(() => {
    if (updatedPost) getPost();
  }, [updatedPost]);

  const { popup, setPopup } = usePopup(() => {});
  useEffect(() => {
    if (response.length > 0) setPopup("Посты", response);
  }, [response]);

  if (posts.length === 0 && !topicParentInfo?.accessPost) return <div></div>;
  else if (posts.length === 0)
    return (
      <div className="post-list">
        <div className="post-list__create-post-button">
          <img src={messageWhite} alt="" /> <p>Создать новую тему</p>
        </div>
      </div>
    );

  return (
    <div className="post-list">
      {popup}
      <NavLink
        to={`/create/post/${topicID}`}
        className="post-list__create-post-button"
      >
        <img src={messageWhite} alt="" /> <p>Создать новую тему</p>
      </NavLink>
      <PageNavBar page={true} filter={true} maxPage={maxPage} />
      <div className="post-list__wrapper">
        {!isLoadingAuth && !isLoadingUser && isSmallLoading && <SmallLoader />}
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
      <PageNavBar page={true} filter={true} maxPage={maxPage} />
    </div>
  );
};
