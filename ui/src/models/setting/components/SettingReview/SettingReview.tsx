import { getSettingLink } from "../../../../helpers/getLinks";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import "./SettingReview.scss";
import { SettingReviewItem } from "./SettingReviewItem";
import { useConfirm } from "../../../../hooks/useConfirm";
import {
  updateEmailNote,
  updatePasswordNote,
} from "../../../../store/reducers/user/userActionCreator";
import { usePopup } from "../../../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";

export const SettingReview: React.FC = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { userInfo, response } = useAppSelector((state) => state.user);
  const getUserName = (name: string) => {
    const correctName = name.replace(name[0], name[0].toUpperCase());
    return correctName;
  };

  const { popup, setPopup } = usePopup();
  const isPossibleChange = (last: string | undefined) => {
    if (!last) return false;
    const lastDate = new Date(last);
    lastDate.setDate(lastDate.getDate() + 1);
    if (new Date() < lastDate) return false;

    return true;
  };

  const { confirm, checkConfirm } = useConfirm();
  const sendEmailNote = () => {
    dispath(updateEmailNote());
  };
  const sendPasswordNote = () => {
    dispath(updatePasswordNote());
  };

  const checkConfirmEmail = () => {
    if (!isPossibleChange(userInfo?.confirmEmailLast))
      return setPopup(
        "Электронная почта",
        "С последней смены электронной почты не прошел один день!"
      );
    checkConfirm(
      "Электронная почта",
      "Вы уверены, что хотите изменить электронную почту?",
      sendEmailNote
    );
  };
  const checkConfirmPassword = () => {
    if (!isPossibleChange(userInfo?.resetPasswordLast))
      return setPopup(
        "Пароль",
        "С последней смены пароля не прошел один день!"
      );
    checkConfirm(
      "Пароль",
      "Вы уверены, что хотите изменить пароль?",
      sendPasswordNote
    );
  };

  useEffectOnlyUpdate(() => {
    if (response.length > 0) setPopup("Cмена данных", response);
  }, [response]);

  if (!userInfo) return <div></div>;
  return (
    <div className="setting-review">
      {confirm}
      {popup}
      <SettingReviewItem
        title="Отображаемое имя"
        caption={userInfo.nickName}
        action={() => {
          navigate(getSettingLink("nick-name"));
        }}
      />
      <SettingReviewItem
        title="Имя пользователя"
        caption={getUserName(userInfo.userName)}
        action={() => {
          navigate(getSettingLink("user-name"));
        }}
      />
      <SettingReviewItem
        title="Email"
        caption={userInfo.email}
        action={checkConfirmEmail}
      />
      <SettingReviewItem
        title="Пароль"
        caption="*****"
        action={checkConfirmPassword}
      />
    </div>
  );
};
