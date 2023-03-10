import { PostItem } from "./components/PostItem/PostItem";
import messageWhite from "./../../assets/media/comment-white.png";
import "./PostList.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect } from "react";
import { getPostByTopicID } from "../../store/reducers/post/postActionCreator";
import { SmallLoader } from "../../components/SmallLoader/SmallLoader";
import { useCustomSearchParams } from "../../hooks/useCustomSearchParams";
import { useParams } from "react-router-dom";
import { PageNavBar } from "../../models/pageNavBar/PageNavBar";
import { typeSearch } from "../../models/pageNavBar/types";

export const PostList: React.FC = () => {
  const [search, setSearch] = useCustomSearchParams() as typeSearch;
  const { id: topicID } = useParams();

  const { parentInfo: topicParentInfo } = useAppSelector(
    (state) => state.topic
  );
  const { isLoading: isLoadingAuth } = useAppSelector((state) => state.auth);
  const { isLoading: isLoadingUser } = useAppSelector((state) => state.user);
  const { posts, isSmallLoading, maxPage } = useAppSelector(
    (state) => state.post
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const page = search.page ? search.page : "1";
    const filter = search.filter ? search.filter : "last-date-create";
    setSearch({ page, filter }, { replace: true });
  }, [topicID]);
  useEffect(() => {
    if (topicID && (search.page || search.filter))
      dispatch(
        getPostByTopicID({
          page: search.page,
          filter: search.filter,
          topicID: +topicID,
        })
      );
  }, [search.page, search.filter, topicID]);

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
      <div className="post-list__create-post-button">
        <img src={messageWhite} alt="" /> <p>Создать новую тему</p>
      </div>
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
