import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
import { getSettingLink } from "../../../../helpers/getLinks";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useConfirm } from "../../../../hooks/useConfirm";
import { usePopup } from "../../../../hooks/usePopup";
import { useEffectOnlyUpdate } from "../../../../hooks/useResponse";
import { useValidation } from "../../../../hooks/useValidation";
import {
  settingValidation,
  settingValidationField,
} from "../../../../models/setting/validation/settingValidation";
import { useNavigate } from "react-router-dom";
import { updateNickName } from "../../../../store/reducers/user/userActionCreator";
import { useState, useEffect } from "react";
import "./SettingNickName.scss";

export const SettingNickName: React.FC = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { userInfo, response } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (userInfo) setForm({ nickName: userInfo.nickName });
  }, [userInfo]);
  const [form, setForm] = useState<{ [key: string]: any; nickName: string }>({
    nickName: "",
  });
  const [errorForm, setErrorForm] = useState<{
    [key: string]: any;
    nickName: string;
  }>({
    nickName: "",
  });
  useValidation(form, errorForm, setErrorForm, settingValidationField);

  const { confirm, checkConfirm } = useConfirm();
  const { popup, setPopup } = usePopup();
  const sendForm = () => {
    dispath(updateNickName(form.nickName));
  };
  const checkForm = () => {
    settingValidation(form, errorForm, setErrorForm);
    for (const field in errorForm) {
      if (errorForm[field].length > 0) return;
    }
    checkConfirm(
      "Отображаемое имя",
      "Вы действительно хотите изменить отображаемое имя?",
      sendForm
    );
  };

  useEffectOnlyUpdate(() => {
    if (response.length > 0)
      setPopup("Отображаемое имя", response, () => {
        navigate(getSettingLink("review"));
      });
  }, [response]);

  return (
    <div className="setting-nick-name">
      {confirm}
      {popup}
      <InputTooltip
        value={form.nickName}
        setValue={(v: string) => {
          setForm({ nickName: v });
        }}
        error={errorForm.nickName}
        title="Отображаемое имя"
        type="text"
      />
      <div className="setting-nick-name__button-wrapper">
        <BlackButton onClick={checkForm}> Изменить </BlackButton>
      </div>
    </div>
  );
};
