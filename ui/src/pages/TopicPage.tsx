import { PostList } from "../models/post/PostList";
import { TopicList } from "../models/topic/TopicList";

export const TopicPage: React.FC = () => {
  return (
    <div className="topic-page">
      <TopicList />
      <PostList />
    </div>
  );
};
