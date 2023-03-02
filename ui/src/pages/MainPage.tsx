import { useAppSelector } from "../hooks/redux";
import { LastPosts } from "../components/LastPosts/LastPosts";
import { TopicList } from "../models/topic/TopicList";
import "./pages.scss";
import { Loader } from "../components/Loader/Loader";

export const MainPage: React.FC = () => {
  const { isLoading: isLoadingTopic } = useAppSelector((state) => state.topic);

  return (
    <div className="main-page__wrapper">
      {isLoadingTopic && <Loader />}
      <TopicList />
      <LastPosts />
    </div>
  );
};
