import { useAppDispatch } from "../../../../hooks/redux";
import { useState } from "react";
import { CommentEditor } from "../CommentEditor/CommentEditor";
import "./UpdateComment.scss";
import { updateComment } from "../../../../store/reducers/comment/commentCreateAction";
import { useConfirm } from "../../../../hooks/useConfirm";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";

interface IUpdateCommentProps {
  commentBody: string;
  commentID: string;
  close: () => void;
}

export const UpdateComment: React.FC<IUpdateCommentProps> = ({
  commentBody,
  commentID,
  close,
}) => {
  const dispatch = useAppDispatch();
  const [body, setBody] = useState(commentBody);

  const update = () => {
    dispatch(updateComment({ body, commentID }));
    close();
  };

  const { checkConfirm, confirm } = useConfirm(() => {
    update();
  });
  return (
    <div className="update-comment">
      {confirm}
      <CommentEditor value={body} setValue={(v) => setBody(v)} />
      <div className="comment-editor__button-wrapper">
        <BlackButton
          onClick={() =>
            commentBody.length !== 0
              ? checkConfirm(
                  "Добавление комментария",
                  "Вы уверены, что хотите отправить комментарий?"
                )
              : ""
          }
        >
          Отправить
        </BlackButton>
      </div>
    </div>
  );
};
