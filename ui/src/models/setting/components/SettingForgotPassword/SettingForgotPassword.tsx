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
import { updatePasswordForgot } from "../../../../store/reducers/user/userActionCreator";
import { useState } from "react";

import "../../SettingForm.scss";
import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
interface IEmailForm {
  [key: string]: any;
  email: string;
}
export const SettingForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { response } = useAppSelector((state) => state.user);
  const [form, setForm] = useState<IEmailForm>({
    email: "",
  });
  const [errorForm, setErrorForm] = useState<IEmailForm>({
    email: "",
  });
  useValidation(form, errorForm, setErrorForm, settingValidationField);

  const { popup, setPopup } = usePopup();
  const sendForm = () => {
    dispath(updatePasswordForgot(form.email));
  };
  const checkForm = () => {
    settingValidation(form, errorForm, setErrorForm);
    for (const field in errorForm) {
      if (errorForm[field].length > 0) return;
    }
    sendForm();
  };
  useEffectOnlyUpdate(() => {
    if (response.length > 0)
      setPopup("Новый пароль", response, () => {
        navigate("/");
      });
  }, [response]);
  return (
    <div className="setting-form">
      {popup}
      <div className="setting-form__wrapper">
        <h1 className="setting-form__header">Забыли пароль</h1>
        <p className="setting-form__caption">
          Введите свой адресс электронной почты для получения инструкции по
          смене пароля
        </p>
        <InputTooltip
          value={form.email}
          setValue={(v: string) => {
            setForm({ email: v });
          }}
          error={errorForm.email}
          title="Адресс электронной почты"
          type="text"
        />

        <div className="setting-form__button-wrapper">
          <BlackButton onClick={checkForm}> Изменить </BlackButton>
        </div>
      </div>
    </div>
  );
};
