import {
  updateCommentFixed,
  updateCommentVerified,
} from "../../../../store/reducers/comment/commentCreateAction";
import { useAppDispatch } from "../../../../hooks/redux";
import "./CommentAdminPanel.scss";
import { useConfirm } from "../../../../hooks/useConfirm";

interface ICommentAdminPanelProps {
  commentID: string;
  fixed: boolean;
  verified: boolean;
}

export const CommentAdminPanel: React.FC<ICommentAdminPanelProps> = ({
  commentID,
  fixed,
  verified,
}) => {
  const dispatch = useAppDispatch();

  const changeVerify = () => {
    const value = verified ? false : true;
    dispatch(updateCommentVerified({ commentID, verified: value }));
  };
  const changeFixed = () => {
    const value = fixed ? false : true;
    dispatch(updateCommentFixed({ commentID, fixed: value }));
  };

  const { checkConfirm: checkConfirmVerify, confirm: confirmVerify } =
    useConfirm(() => {
      changeVerify();
    });
  const { checkConfirm: checkConfirmFixed, confirm: confirmFixed } = useConfirm(
    () => {
      changeFixed();
    }
  );

  return (
    <div className="comment-admin-panel">
      {confirmFixed}
      {confirmVerify}
      <div className="comment-admin-panel__item">
        <p>Утвердить</p>
        <input
          type="checkbox"
          checked={verified ? true : false}
          onClick={() => {
            checkConfirmVerify(
              "Изменить статус комментария",
              "Вы  уверены, что хотите изменить статус утверждения?"
            );
          }}
          readOnly
        />
      </div>
      <div className="comment-admin-panel__item _last">
        <p>Закрепить</p>
        <input
          type="checkbox"
          checked={fixed ? true : false}
          onClick={() => {
            checkConfirmFixed(
              "Изменить статус комментария",
              "Вы  уверены, что хотите изменить статус закрепления?"
            );
          }}
          readOnly
        />
      </div>
    </div>
  );
};
