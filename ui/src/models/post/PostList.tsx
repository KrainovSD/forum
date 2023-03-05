import { PostItem } from "./components/PostItem/PostItem";
import messageWhite from "./../../assets/media/comment-white.png";
import "./PostList.scss";
import { PostNavBar } from "./components/PostNavBar/PostNavBar";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect } from "react";
import { getPostByTopicID } from "../../store/reducers/post/postActionCreator";
import { SmallLoader } from "../../components/SmallLoader/SmallLoader";
import { useCustomSearchParams } from "../../hooks/useCustomSearchParams";
import { typePostSearch } from "./types/types";
import { useParams } from "react-router-dom";

export const PostList: React.FC = () => {
  const [search, setSearch] = useCustomSearchParams() as typePostSearch;
  const { id: topicID } = useParams();

  const { parentInfo: topicParentInfo } = useAppSelector(
    (state) => state.topic
  );
  const { posts, isLoading } = useAppSelector((state) => state.post);
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
      <PostNavBar />
      <div className="post-list__wrapper">
        {isLoading && <SmallLoader />}
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
      <PostNavBar />
    </div>
  );
};
