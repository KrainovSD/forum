import { BlackButton } from "../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../components/UI/InputTooltip/InputTooltip";
import { NavLink, useNavigate } from "react-router-dom";
import "./Auth.scss";
import { useState, useEffect } from "react";
import {
  authValidation,
  authValidationField,
} from "./validation/authValidation";
import { useValidation } from "../../hooks/useValidation";
import { Loader } from "../../components/Loader/Loader";
import { PasswordInputTooltip } from "../../components/UI/PasswordInputTooltip/PasswordInputTooltip";
import useFetching from "../../hooks/useFetching";
import { axiosInstance } from "../../helpers/axiosInstance";
import { useAppDispatch } from "../../hooks/redux";
import { authSlice } from "../../store/reducers/auth/authReducer";
import { usePopup } from "../../hooks/usePopup";

interface ILoginForm {
  [key: string]: string;
  nickName: string;
  password: string;
}
interface ILoginResponse {
  message: string;
  token: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    nickName: "",
    password: "",
  });
  const [errorLoginForm, setErrorLoginForm] = useState<ILoginForm>({
    nickName: "",
    password: "",
  });
  useValidation(
    loginForm,
    errorLoginForm,
    setErrorLoginForm,
    authValidationField
  );

  const { setPopup, popup } = usePopup(() => {});
  const sendForm = async () => {
    const response = await axiosInstance.post<ILoginResponse>(
      "/api/auth/login",
      loginForm
    );
    dispatch(authSlice.actions.setAuth());
    localStorage.setItem("token", response.data.token);
    navigate("/", {
      replace: true,
    });
  };
  const { fetching, isLoading } = useFetching(
    sendForm,
    setPopup,
    "Авторизация"
  );
  const checkLoginForm = () => {
    if (isLoading) return;
    authValidation(loginForm, errorLoginForm, setErrorLoginForm);
    for (let field in errorLoginForm) {
      const fieldData = errorLoginForm[field];
      if (fieldData.length > 0) return;
    }
    fetching();
  };

  return (
    <div className="auth__wrapper">
      {isLoading && <Loader />}
      {popup}

      <div className="auth">
        <div className="auth__contentWapper">
          <h1 className="auth__header">Войти</h1>
          <p className="auth__subHeader">
            Еще нет учетной записи?{" "}
            <NavLink to="/register">Регистрация</NavLink>
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
          <PasswordInputTooltip
            title="Пароль"
            error={errorLoginForm.password}
            value={loginForm.password}
            setValue={(value: string) =>
              setLoginForm({ ...loginForm, password: value })
            }
          />
          <BlackButton onClick={() => checkLoginForm()}>Войти</BlackButton>

          <NavLink to="/forgot" className="auth__forgot">
            Забыли пароль?
          </NavLink>
        </div>
      </div>
    </div>
  );
};
