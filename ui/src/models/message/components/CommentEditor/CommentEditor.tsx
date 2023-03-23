import { useRef } from "react";
import "./CommentEditor.scss";

interface ICommentEditorProps {
  value: string;
  setValue: (v: string) => void;
}

export const CommentEditor: React.FC<ICommentEditorProps> = ({
  value,
  setValue,
}) => {
  const changeField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "20px";
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
    setValue(e.currentTarget.value);
  };

  return (
    <div className="comment-editor">
      <textarea name="" id="" onChange={changeField} value={value}></textarea>
    </div>
  );
};
