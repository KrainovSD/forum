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
  const createComment = () => {
    console.log(value);
  };
  return (
    <div className="comment-editor">
      <textarea
        name=""
        id="comment"
        className="comment-editor__field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
      <div className="comment-editor__button-wrapper">
        <BlackButton onClick={createComment}>Отправить</BlackButton>
      </div>
    </div>
  );
};
