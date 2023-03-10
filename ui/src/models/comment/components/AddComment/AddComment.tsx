import { useState } from "react";
import { CommentEditor } from "../CommentEditor/CommentEditor";
import "./AddComment.scss";

export const AddComment: React.FC = () => {
  const [commentBody, setCommentBody] = useState<string>("");
  return (
    <CommentEditor
      value={commentBody}
      setValue={(v: string) => {
        setCommentBody(v);
      }}
    />
  );
};
