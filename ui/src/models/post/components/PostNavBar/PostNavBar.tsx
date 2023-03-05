import "./PostNavBar.scss";
import { PostPageSwitch } from "../PostPageSwitch/PostPageSwitch";
import { PostSort } from "../PostSort/PostSort";
import { PostPageList } from "../PostPageList/PostPageList";

export const PostNavBar: React.FC = () => {
  return (
    <div className="post-nav-bar">
      <PostPageList />
      <PostPageSwitch />
      <PostSort />
    </div>
  );
};
