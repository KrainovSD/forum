import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useValidation } from "../../../../hooks/useValidation";
import {
  settingValidation,
  settingValidationField,
} from "../../../../models/setting/validation/settingValidation";
import { useState, useEffect } from "react";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
import "./SettingUserName.scss";
import { useConfirm } from "../../../../hooks/useConfirm";
import { usePopup } from "../../../../hooks/usePopup";
import { updateUserName } from "../../../../store/reducers/user/userActionCreator";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { useNavigate } from "react-router-dom";
import { getSettingLink } from "../../../../helpers/getLinks";

export const SettingUserName: React.FC = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { userInfo, response } = useAppSelector((state) => state.user);
  const getUserName = (name: string) => {
    const correctName = name.replace(name[0], name[0].toUpperCase());
    return correctName;
  };
  useEffect(() => {
    if (userInfo) setForm({ userName: getUserName(userInfo.userName) });
  }, [userInfo]);
  const [form, setForm] = useState<{ [key: string]: any; userName: string }>({
    userName: "",
  });
  const [errorForm, setErrorForm] = useState<{
    [key: string]: any;
    userName: string;
  }>({
    userName: "",
  });
  useValidation(form, errorForm, setErrorForm, settingValidationField);

  const { confirm, checkConfirm } = useConfirm();
  const { popup, setPopup } = usePopup();
  const sendForm = () => {
    dispath(updateUserName(form.userName));
  };
  const checkForm = () => {
    settingValidation(form, errorForm, setErrorForm);
    for (const field in errorForm) {
      if (errorForm[field].length > 0) return;
    }
    checkConfirm(
      "Имя пользователя",
      "Вы действительно хотите изменить имя пользователя?",
      sendForm
    );
  };

  useEffectOnlyUpdate(() => {
    if (response.length > 0)
      setPopup("Имя пользователя", response, () => {
        navigate(getSettingLink("review"));
      });
  }, [response]);

  return (
    <div className="setting-user-name">
      {confirm}
      {popup}
      <InputTooltip
        value={form.userName}
        setValue={(v: string) => {
          setForm({ userName: v });
        }}
        error={errorForm.userName}
        title="Имя пользователя"
        type="text"
      />
      <div className="setting-user-name__button-wrapper">
        <BlackButton onClick={checkForm}> Изменить </BlackButton>
      </div>
    </div>
  );
};
