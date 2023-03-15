import { useConfirm } from "../../../../hooks/useConfirm";
import { useAppDispatch } from "../../../../hooks/redux";
import { deleteComment } from "../../../../store/reducers/comment/commentCreateAction";
import "./DeleteComment.scss";

interface IDeleteCommentProps {
  commentID: string;
}

export const DeleteComment: React.FC<IDeleteCommentProps> = ({ commentID }) => {
  const dispatch = useAppDispatch();

  const executeDelete = () => {
    dispatch(deleteComment(commentID));
  };

  const { checkConfirm, confirm } = useConfirm(() => {
    executeDelete();
  });
  return (
    <div className="delete-comment">
      {confirm}
      <div
        className="delete-comment__button"
        onClick={() => {
          checkConfirm(
            "Удаление комментария",
            "Вы уверены, что хотите удалить комментарий?"
          );
        }}
      >
        Удалить
      </div>
    </div>
  );
};
