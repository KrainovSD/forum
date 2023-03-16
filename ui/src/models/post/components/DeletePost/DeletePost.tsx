import { deletePost } from "../../../../store/reducers/post/postActionCreator";
import { useAppDispatch } from "../../../../hooks/redux";
import { useConfirm } from "../../../../hooks/useConfirm";

interface IDeletePostProps {
  postID: string;
}

export const DeletePost: React.FC<IDeletePostProps> = ({ postID }) => {
  const dispatch = useAppDispatch();
  const removePost = () => {
    dispatch(deletePost(postID));
  };
  const { checkConfirm, confirm } = useConfirm(() => removePost());

  return (
    <div>
      {confirm}
      <div
        className="post-admin-panel__item"
        onClick={() =>
          checkConfirm("Удаление темы", "Вы уверены, что хотите удалить тему?")
        }
      >
        Удалить
      </div>
    </div>
  );
};
