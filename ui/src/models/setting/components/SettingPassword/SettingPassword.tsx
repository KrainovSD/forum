import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
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
import { useNavigate, useParams } from "react-router-dom";
import { updatePassword } from "../../../../store/reducers/user/userActionCreator";
import { useEffect, useState } from "react";
import "../../SettingForm.scss";
import { PasswordInputTooltip } from "../../../../components/UI/PasswordInputTooltip/PasswordInputTooltip";

interface IPasswordForm {
  [key: string]: any;
  password: string;
  repeatPassword: string;
}

export const SettingPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { response } = useAppSelector((state) => state.user);
  const { key } = useParams();
  const [form, setForm] = useState<IPasswordForm>({
    password: "",
    repeatPassword: "",
  });
  const [errorForm, setErrorForm] = useState<IPasswordForm>({
    password: "",
    repeatPassword: "",
  });
  useValidation(form, errorForm, setErrorForm, settingValidationField);

  const { confirm, checkConfirm } = useConfirm();
  const { popup, setPopup } = usePopup();
  const sendForm = () => {
    if (key) dispath(updatePassword({ key, password: form.password }));
  };
  const checkForm = () => {
    settingValidation(form, errorForm, setErrorForm);
    for (const field in errorForm) {
      if (errorForm[field].length > 0) return;
    }
    checkConfirm(
      "Новый пароль",
      "Вы действительно хотите изменить пароль?",
      sendForm
    );
  };

  useEffectOnlyUpdate(() => {
    if (response.length > 0)
      setPopup("Новый пароль", response, () => {
        navigate("/");
      });
  }, [response]);
  return (
    <div className="setting-form">
      {confirm}
      {popup}
      <div className="setting-form__wrapper">
        <h1 className="setting-form__header">Смена пароля</h1>
        <PasswordInputTooltip
          value={form.password}
          setValue={(v: string) => {
            setForm({ ...form, password: v });
          }}
          error={errorForm.password}
          title="Пароль"
          advice={true}
        />
        <PasswordInputTooltip
          value={form.repeatPassword}
          setValue={(v: string) => {
            setForm({ ...form, repeatPassword: v });
          }}
          error={errorForm.repeatPassword}
          title="Повторите пароль"
        />
        <div className="setting-form__button-wrapper">
          <BlackButton onClick={checkForm}> Изменить </BlackButton>
        </div>
      </div>
    </div>
  );
};
