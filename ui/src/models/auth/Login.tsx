import { BlackButton } from "../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../components/UI/InputTooltip/InputTooltip";
import { NavLink } from "react-router-dom";
import "./Auth.scss";
import { useState } from "react";
import {
  authValidation,
  authValidationField,
} from "./validation/authValidation";
import { useValidation } from "../../hooks/useValidation";

interface loginForm {
  [key: string]: string;
  nickName: string;
  password: string;
}

export const Login: React.FC = () => {
  const [loginForm, setLoginForm] = useState<loginForm>({
    nickName: "",
    password: "",
  });
  const [errorLoginForm, setErrorLoginForm] = useState<loginForm>({
    nickName: "",
    password: "",
  });

  useValidation(
    loginForm,
    errorLoginForm,
    setErrorLoginForm,
    authValidationField
  );

  const sendLoginForm = () => {
    authValidation(loginForm, errorLoginForm, setErrorLoginForm);
    for (let field in errorLoginForm) {
      const fieldData = errorLoginForm[field];
      if (fieldData.length > 0) return;
    }
    console.log("clear");
  };

  return (
    <div className="auth__wrapper">
      <div className="auth">
        <h1 className="auth__header">Войти</h1>
        <p className="auth__subHeader">
          Еще нет учетной записи? <NavLink to="/register">Регистрация</NavLink>
        </p>
        <InputTooltip
          type="text"
          title="Отображаемое имя (Никнейм)"
          error={errorLoginForm.nickName}
          value={loginForm.nickName}
          setValue={(value: string) =>
            setLoginForm({ ...loginForm, nickName: value })
          }
        />
        <InputTooltip
          type="password"
          title="Пароль"
          error={errorLoginForm.password}
          value={loginForm.password}
          setValue={(value: string) =>
            setLoginForm({ ...loginForm, password: value })
          }
        />
        <BlackButton onClick={() => sendLoginForm()}>Войти</BlackButton>

        <NavLink to="/forgot" className="auth__forgot">
          Забыли пароль?
        </NavLink>
      </div>
    </div>
  );
};
