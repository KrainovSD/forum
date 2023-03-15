import { useConfirm } from "../../../../hooks/useConfirm";
import { useAppDispatch } from "../../../../hooks/redux";
import "./PostAdmitPanel.scss";
import {
  updatePostClosed,
  updatePostFixed,
  updatePostVerify,
} from "../../../../store/reducers/post/postActionCreator";

interface IPostAdminPanelProps {
  postID: string;
  closed: boolean;
  fixed: boolean;
  verified: boolean;
}

export const PostAdmitPanel: React.FC<IPostAdminPanelProps> = ({
  postID,
  closed,
  fixed,
  verified,
}) => {
  const dispatch = useAppDispatch();
  const changeClosed = () => {
    const value = closed ? false : true;
    dispatch(updatePostClosed({ postID, value }));
  };
  const changeFixed = () => {
    const value = fixed ? false : true;
    dispatch(updatePostFixed({ postID, value }));
  };
  const changeVerified = () => {
    const value = verified ? false : true;
    dispatch(updatePostVerify({ postID, value }));
  };

  const { checkConfirm: checkConfirmClosed, confirm: confirmClosed } =
    useConfirm(() => {
      changeClosed();
    });
  const { checkConfirm: checkConfirmFixed, confirm: confirmFixed } = useConfirm(
    () => {
      changeFixed();
    }
  );
  const { checkConfirm: checkConfirmVerify, confirm: confirmVerify } =
    useConfirm(() => {
      changeVerified();
    });
  const title = "Изменить статус поста";

  return (
    <div className="post-admin-panel">
      {confirmClosed}
      {confirmFixed}
      {confirmVerify}
      <div className="post-admin-panel__item">Удалить</div>
      <div className="post-admin-panel__item">Изменить</div>
      <div
        className="post-admin-panel__item"
        onClick={() => {
          checkConfirmClosed(
            title,
            "Вы уверены, что хотите изменить статус закрытия?"
          );
        }}
      >
        <p>Закрыть</p>
        <input type="checkbox" checked={closed ? true : false} readOnly />
      </div>
      <div
        className="post-admin-panel__item"
        onClick={() => {
          checkConfirmFixed(
            title,
            "Вы уверены, что хотите изменить статус закрепления?"
          );
        }}
      >
        <p>Закрепить</p>
        <input type="checkbox" checked={fixed ? true : false} readOnly />
      </div>
      <div
        className="post-admin-panel__item"
        onClick={() => {
          checkConfirmVerify(
            title,
            "Вы уверены, что хотите изменить статус утверждения?"
          );
        }}
      >
        <p>Утвердить</p>
        <input type="checkbox" checked={verified ? true : false} readOnly />
      </div>
    </div>
  );
};
