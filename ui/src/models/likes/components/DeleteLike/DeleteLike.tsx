import "./DeleteLike.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { deleteLike } from "../../../../store/reducers/like/likeActionCreator";

interface IDeleteLikeProps {
  commentID: string;
}

export const DeleteLike: React.FC<IDeleteLikeProps> = ({ commentID }) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="delete-like"
      onClick={() => {
        dispatch(deleteLike(commentID));
      }}
    >
      -
    </div>
  );
};
