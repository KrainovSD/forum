import { useAppDispatch } from "../../../../hooks/redux";
import { createComment } from "../../../../store/reducers/comment/commentCreateAction";
import { useState } from "react";
import { CommentEditor } from "../CommentEditor/CommentEditor";
import "./AddComment.scss";
import { useConfirm } from "../../../../hooks/useConfirm";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";

interface IAddCommentProps {
  main: boolean;
  postID: string;
}

export const AddComment: React.FC<IAddCommentProps> = ({ main, postID }) => {
  const dispatch = useAppDispatch();
  const [commentBody, setCommentBody] = useState<string>("");

  const addComment = () => {
    dispatch(createComment({ body: commentBody, main, postID }));
    setCommentBody("");
  };

  const { checkConfirm, confirm } = useConfirm(() => {
    addComment();
  });

  return (
    <div className="add-comment">
      {confirm}
      <CommentEditor
        value={commentBody}
        setValue={(v: string) => {
          setCommentBody(v);
        }}
      />
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
