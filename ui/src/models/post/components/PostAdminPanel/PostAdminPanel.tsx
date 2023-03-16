import { useConfirm } from "../../../../hooks/useConfirm";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import "./PostAdmitPanel.scss";
import {
  updatePostClosed,
  updatePostFixed,
  updatePostVerify,
} from "../../../../store/reducers/post/postActionCreator";
import { DeletePost } from "../DeletePost/DeletePost";
import { NavLink } from "react-router-dom";

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
  const { userInfo } = useAppSelector((state) => state.user);
  const titleConfirm = "Изменить статус поста";
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

  const { confirm, checkConfirm } = useConfirm();

  const conditionToVisibleAdminTools =
    userInfo && (userInfo.role === "admin" || userInfo.role === "moder");

  return (
    <div className="post-admin-panel">
      {confirm}
      {conditionToVisibleAdminTools && <DeletePost postID={postID} />}
      <NavLink to={`/update/post/${postID}`} className="post-admin-panel__item">
        Изменить
      </NavLink>
      {conditionToVisibleAdminTools && (
        <div
          className="post-admin-panel__item"
          onClick={() => {
            checkConfirm(
              titleConfirm,
              "Вы уверены, что хотите изменить статус закрытия?",
              changeClosed
            );
          }}
        >
          <p>Закрыть</p>
          <input type="checkbox" checked={closed ? true : false} readOnly />
        </div>
      )}
      {conditionToVisibleAdminTools && (
        <div
          className="post-admin-panel__item"
          onClick={() => {
            checkConfirm(
              titleConfirm,
              "Вы уверены, что хотите изменить статус закрепления?",
              changeFixed
            );
          }}
        >
          <p>Закрепить</p>
          <input type="checkbox" checked={fixed ? true : false} readOnly />
        </div>
      )}
      {conditionToVisibleAdminTools && (
        <div
          className="post-admin-panel__item"
          onClick={() => {
            checkConfirm(
              titleConfirm,
              "Вы уверены, что хотите изменить статус утверждения?",
              changeVerified
            );
          }}
        >
          <p>Утвердить</p>
          <input type="checkbox" checked={verified ? true : false} readOnly />
        </div>
      )}
    </div>
  );
};
