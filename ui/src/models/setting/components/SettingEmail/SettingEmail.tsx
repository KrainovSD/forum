import { BlackButton } from "../../../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../../../components/UI/InputTooltip/InputTooltip";
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
import { updateEmail } from "../../../../store/reducers/user/userActionCreator";
import { useState } from "react";
import "../../SettingForm.scss";

interface IEmailForm {
  [key: string]: any;
  email: string;
}

export const SettingEmail: React.FC = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { response } = useAppSelector((state) => state.user);
  const { key } = useParams();
  const [form, setForm] = useState<IEmailForm>({
    email: "",
  });
  const [errorForm, setErrorForm] = useState<IEmailForm>({
    email: "",
  });
  useValidation(form, errorForm, setErrorForm, settingValidationField);

  const { confirm, checkConfirm } = useConfirm();
  const { popup, setPopup } = usePopup();
  const sendForm = () => {
    if (key) dispath(updateEmail({ key, email: form.email }));
  };
  const checkForm = () => {
    settingValidation(form, errorForm, setErrorForm);
    for (const field in errorForm) {
      if (errorForm[field].length > 0) return;
    }
    checkConfirm(
      "Новый адресс электронной почты",
      "Вы действительно хотите изменить адресс электронной почты?",
      sendForm
    );
  };

  useEffectOnlyUpdate(() => {
    if (response.length > 0)
      setPopup("Новый адресс электронной почты", response, () => {
        navigate("/");
      });
  }, [response]);

  return (
    <div className="setting-form">
      {confirm}
      {popup}
      <div className="setting-form__wrapper">
        <h1 className="setting-form__header">Смена адреса электронной почты</h1>
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
