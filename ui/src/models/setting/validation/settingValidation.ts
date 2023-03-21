interface ISettingFormValidation {
  [key: string]: any;
  nickName?: string;
  userName?: string;
  password?: string;
  repeatPassword?: string;
  email?: string;
}

export const settingValidation = (
  form: ISettingFormValidation,
  error: ISettingFormValidation,
  setError: React.Dispatch<React.SetStateAction<ISettingFormValidation>>
) => {
  for (let field in form) {
    const fieldData: string = form[field];
    settingValidationField(field, fieldData, error, setError, form);
  }
};

export const settingValidationField = (
  field: string,
  fieldData: string,
  error: ISettingFormValidation,
  setError: React.Dispatch<React.SetStateAction<ISettingFormValidation>>,
  form: ISettingFormValidation
) => {
  if (!(field in error)) return;
  if (fieldData.length === 0) {
    error[field] = "Поле обязательно для заполнения!";
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
      if (fieldData.length < 8 || fieldData.length > 30) {
        error[field] =
          "Длина пароля должна быть не менее 8 символов и не более 30 символов!";
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
      if (fieldData.length < 2 || fieldData.length > 15) {
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
      if (!(fieldData === form.password)) {
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
