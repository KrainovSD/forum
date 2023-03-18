import list from "../../assets/media/list.png";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect } from "react";
import "./LastPosts.scss";
import { getLastPosts } from "../../store/reducers/post/postActionCreator";
import { LastPostItem } from "./LastPostItem";

export const LastPosts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lastPosts } = useAppSelector((state) => state.post);
  useEffect(() => {
    dispatch(getLastPosts());
  }, []);

  return (
    <div className="last-posts">
      <div className="last-posts__header">
        <img src={list} alt="" />
        <p>Последние темы</p>
      </div>
      <div className="last-posts__content">
        {lastPosts.map((post) => (
          <LastPostItem post={post} key={post.postID} />
        ))}
      </div>
    </div>
  );
};
