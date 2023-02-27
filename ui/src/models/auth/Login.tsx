import { BlackButton } from "../../components/UI/BlackButton/BlackButton";
import { InputTooltip } from "../../components/UI/InputTooltip/InputTooltip";
import { NavLink, useNavigate } from "react-router-dom";
import "./Auth.scss";
import { useState } from "react";
import {
  authValidation,
  authValidationField,
} from "./validation/authValidation";
import { useValidation } from "../../hooks/useValidation";
import { Loader } from "../../components/Loader/Loader";
import { PasswordInputTooltip } from "../../components/UI/PasswordInputTooltip/PasswordInputTooltip";
import useFetching from "../../hooks/useFetching";
import { Popup } from "../../components/Popup/Popup";
import { popupTypes } from "../../types/popupTypes";
import { axiosInstance } from "../../helpers/axiosInstance";
import { useAppDispatch } from "../../hooks/redux";
import { authSlice } from "../../store/reducers/auth/authReducer";

interface loginForm {
  [key: string]: string;
  nickName: string;
  password: string;
}
interface loginResponse {
  message: string;
  token: string;
  role: string;
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
  const [popupInfo, setPopupInfo] = useState<popupTypes>({
    title: "Авторизация",
    body: "",
    isVisible: false,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [sendForm, isLoading, error, errorStatus] = useFetching(
    async () => {
      const response = await axiosInstance.post<loginResponse>(
        "/api/auth/login",
        loginForm
      );
      dispatch(authSlice.actions.setAuth(response.data.role));
      localStorage.setItem("token", response.data.token);
    },
    popupInfo,
    setPopupInfo
  );

  const sendLoginForm = () => {
    if (isLoading) return;
    authValidation(loginForm, errorLoginForm, setErrorLoginForm);
    for (let field in errorLoginForm) {
      const fieldData = errorLoginForm[field];
      if (fieldData.length > 0) return;
    }
    sendForm();
  };

  return (
    <div className="auth__wrapper">
      {isLoading && <Loader />}
      {popupInfo.isVisible && (
        <Popup
          title={popupInfo.title}
          body={popupInfo.body}
          action={() => {
            if (errorStatus !== 0)
              return setPopupInfo({ ...popupInfo, isVisible: false, body: "" });
            navigate("/", {
              replace: true,
            });
          }}
        />
      )}

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
          <BlackButton onClick={() => sendLoginForm()}>Войти</BlackButton>

          <NavLink to="/forgot" className="auth__forgot">
            Забыли пароль?
          </NavLink>
        </div>
      </div>
    </div>
  );
};
