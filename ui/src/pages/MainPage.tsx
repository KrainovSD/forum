import { LastPosts } from "../components/LastPosts/LastPosts";
import { TopicList } from "../models/topic/TopicList";
import "./pages.scss";

export const MainPage: React.FC = () => {
  return (
    <div className="main-page__wrapper">
      <TopicList />
      <LastPosts />
    </div>
  );
};
