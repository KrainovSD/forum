import { BlackButton } from "../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../components/UI/InputTooltip/InputTooltip";
import "./Auth.scss";
import { useState } from "react";
import {
  authValidation,
  authValidationField,
} from "./validation/authValidation";
import { useValidation } from "../../hooks/useValidation";
import { PasswordInputTooltip } from "../../components/UI/PasswordInputTooltip/PasswordInputTooltip";
import { Loader } from "../../components/Loader/Loader";
import useFetching from "../../hooks/useFetching";
import { axiosInstance } from "../../helpers/axiosInstance";
import { IPopup, Popup } from "../../components/Popup/Popup";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../hooks/usePopup";

interface RegisterForm {
  [key: string]: string;
  userName: string;
  nickName: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    userName: "",
    nickName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [errorRegisterForm, setErrorRegisterForm] = useState<RegisterForm>({
    userName: "",
    nickName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  useValidation(
    registerForm,
    errorRegisterForm,
    setErrorRegisterForm,
    authValidationField
  );

  const { popup, setPopup } = usePopup(() => {});
  const checkForm = () => {
    if (isLoading) return;
    authValidation(registerForm, errorRegisterForm, setErrorRegisterForm);
    for (let field in errorRegisterForm) {
      const fieldData = errorRegisterForm[field];
      if (fieldData.length > 0) return;
    }
    fetching();
  };
  const sendForm = async () => {
    const respose = await axiosInstance.post<string>(
      "/api/auth/register",
      registerForm
    );
    const message = respose.data;
    setPopup("Регистрация", message, () => {
      navigate("/", {
        replace: true,
      });
    });
  };
  const { fetching, isLoading, status } = useFetching(
    sendForm,
    setPopup,
    "Регистрация"
  );

  return (
    <div className="auth__wrapper">
      {isLoading && <Loader />}
      {popup}

      <div className="auth">
        <div className="auth__contentWapper">
          <h1 className="auth__header">Регистрация</h1>
          <InputTooltip
            type="text"
            title="Имя пользователя"
            error={errorRegisterForm.userName}
            value={registerForm.userName}
            setValue={(value: string) =>
              setRegisterForm({ ...registerForm, userName: value })
            }
          />
          <InputTooltip
            type="text"
            title="Отображаемое имя (Никнейм)"
            error={errorRegisterForm.nickName}
            value={registerForm.nickName}
            setValue={(value: string) =>
              setRegisterForm({ ...registerForm, nickName: value })
            }
          />
          <InputTooltip
            type="text"
            title="Адресс электронной почты"
            error={errorRegisterForm.email}
            value={registerForm.email}
            setValue={(value: string) =>
              setRegisterForm({ ...registerForm, email: value })
            }
          />
          <PasswordInputTooltip
            title="Пароль"
            error={errorRegisterForm.password}
            value={registerForm.password}
            setValue={(value: string) =>
              setRegisterForm({ ...registerForm, password: value })
            }
            advice={true}
          />
          <PasswordInputTooltip
            title="Повторите пароль"
            error={errorRegisterForm.repeatPassword}
            value={registerForm.repeatPassword}
            setValue={(value: string) =>
              setRegisterForm({ ...registerForm, repeatPassword: value })
            }
          />
          <BlackButton onClick={() => checkForm()}>Регистрация</BlackButton>
        </div>
      </div>
    </div>
  );
};
