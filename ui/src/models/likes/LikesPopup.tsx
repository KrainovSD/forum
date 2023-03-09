import { MouseEvent, useEffect } from "react";
import { AuthorLikeItem } from "./components/AuthorLikeItem/AuthorLikeItem";
import "./LikesPopup.scss";
import closeButton from "../../assets/media/close.png";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getLikeByCommentID } from "../../store/reducers/like/likeActionCreator";

interface ILikesPopupProps {
  closePopup: () => void;
  commentID: string;
}

export const LikesPopup: React.FC<ILikesPopupProps> = ({
  closePopup,
  commentID,
}) => {
  const { likes } = useAppSelector((state) => state.like);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getLikeByCommentID(commentID));
  }, []);

  console.log(likes);

  const close = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains("back-drop__popup")) closePopup();
  };

  return (
    <div className="back-drop__popup" onClick={close}>
      <div className="likes">
        <div className="likes__header">
          {" "}
          <span className="_title">Узнайте, кто на это отреагировал</span>{" "}
          <img
            src={closeButton}
            alt=""
            onClick={() => {
              closePopup();
            }}
          />
        </div>
        <div className="likes__content">
          {likes &&
            likes.map((like) => <AuthorLikeItem key={like.id} like={like} />)}
        </div>
      </div>
    </div>
  );
};
