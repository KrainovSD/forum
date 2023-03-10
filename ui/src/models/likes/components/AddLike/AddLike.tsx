import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { createLike } from "../../../../store/reducers/like/likeActionCreator";
import "./AddLike.scss";

interface IAddLikeProps {
  commentID: string;
  authorCommentID: string;
}

export const AddLike: React.FC<IAddLikeProps> = ({
  commentID,
  authorCommentID,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="add-like"
      onClick={() => {
        dispatch(createLike({ commentID, authorCommentID }));
      }}
    >
      +
    </div>
  );
};
