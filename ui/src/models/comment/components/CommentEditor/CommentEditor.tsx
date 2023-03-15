import { useState } from "react";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import "./CommentEditor.scss";

interface ICommentEditorProps {
  value: string;
  setValue: (v: string) => void;
}

export const CommentEditor: React.FC<ICommentEditorProps> = ({
  value,
  setValue,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div className="comment-editor">
      <textarea
        name=""
        className={`comment-editor__field ${isFocus ? "_open" : ""}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setIsFocus(false);
        }}
      ></textarea>
    </div>
  );
};
