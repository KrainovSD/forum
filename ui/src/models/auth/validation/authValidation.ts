interface authForm {
  [key: string]: any;
  nickName: string;
  password: string;
  userName?: string;
  email?: string;
  repeatPassword?: string;
}

export const authValidation = (
  authForm: authForm,
  error: authForm,
  setError: React.Dispatch<React.SetStateAction<authForm>>
) => {
  for (let field in authForm) {
    const fieldData: string = authForm[field];
    authValidationField(field, fieldData, authForm, error, setError);
  }
};

export const authValidationField = (
  field: string,
  fieldData: string,
  authForm: authForm,
  error: authForm,
  setError: React.Dispatch<React.SetStateAction<authForm>>
) => {
  if (fieldData.length === 0) {
    error[field] = "Поле обязяательно для заполнения!";
    setError({ ...error });
    return;
  }
  switch (field) {
    case "nickName": {
      if (!/^([A-Za-z0-9_]+)$/.test(fieldData)) {
        error[field] =
          "Никнейм должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!";
        setError({ ...error });
        return;
      }
      if (fieldData.length < 3 || fieldData.length > 16) {
        error[field] =
          "Длина Никнейм не должна превышать 16 символов или быть меньше, чем 3 символа!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
    case "password": {
      if (fieldData.length < 8) {
        error[field] = "Пароль должен состоять не менее, чем из 8 символов!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
    case "userName": {
      if (!/^([A-Za-zА-Яа-я]+)$/.test(fieldData)) {
        error[field] =
          "Имя может содержать только латинские или русские буквы!";
        setError({ ...error });
        return;
      }
      if (fieldData.length < 2 && fieldData.length > 15) {
        error[field] =
          "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
    case "email": {
      if (
        !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
          fieldData.toLowerCase()
        )
      ) {
        error[field] = "Неверный формат указанной электронной почты!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
    case "repeatPassword": {
      if (!(fieldData === authForm.password)) {
        error[field] = "Пароли не совпадают!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
    default:
      break;
  }
};
