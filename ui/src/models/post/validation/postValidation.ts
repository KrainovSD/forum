interface IPostFormValidation {
  [key: string]: any;
  title: string;
  comment: string;
  topicID?: string;
}

export const postValidation = (
  form: IPostFormValidation,
  error: IPostFormValidation,
  setError: React.Dispatch<React.SetStateAction<IPostFormValidation>>
) => {
  for (let field in form) {
    const fieldData: string = form[field];
    postValidationField(field, fieldData, error, setError, form);
  }
};

export const postValidationField = (
  field: string,
  fieldData: string,
  error: IPostFormValidation,
  setError: React.Dispatch<React.SetStateAction<IPostFormValidation>>,
  form: IPostFormValidation
) => {
  switch (field) {
    case "title": {
      if (fieldData.length === 0) {
        error[field] = "Поле обязяательно для заполнения!";
        setError({ ...error });
        return;
      }
      if (!/^([A-Za-zА-Яа-я0-9 ,.?!-]+)$/.test(fieldData)) {
        error[field] =
          "Заголовок должен состоять из букв русского или английского алфавита, цифр и знаков препинания!";
        setError({ ...error });
        return;
      }
      if (fieldData.length < 5 || fieldData.length > 60) {
        error[field] =
          "Длина заголовка должна быть не менее 5 символов и не более 60!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
    case "topicID": {
      if (fieldData.length === 0) {
        error[field] = "Необходимо выбрать родительский топик!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
    case "comment": {
      if (fieldData.length === 0) {
        error[field] = "Поле обязяательно для заполнения!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
  }
};
