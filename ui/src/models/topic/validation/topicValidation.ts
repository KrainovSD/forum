export interface ITopictFormValidation {
  [key: string]: any;
  title: string;
  topicID: string;
}
export interface ITopicErrorForm {
  [key: string]: any;
  title: string;
}

export const topicValidation = (
  form: ITopictFormValidation,
  error: ITopicErrorForm,
  setError: React.Dispatch<React.SetStateAction<ITopicErrorForm>>
) => {
  for (let field in form) {
    const fieldData: string = form[field];
    topicValidationField(field, fieldData, error, setError, form);
  }
};

export const topicValidationField = (
  field: string,
  fieldData: string,
  error: ITopicErrorForm,
  setError: React.Dispatch<React.SetStateAction<ITopicErrorForm>>,
  form: ITopictFormValidation
) => {
  if (!(field in error)) return;
  switch (field) {
    case "title": {
      if (fieldData.length === 0) {
        error[field] = "Поле обязяательно для заполнения!";
        setError({ ...error });
        return;
      }
      if (!/^([А-Яа-я0-9 ,.?!-]+)$/.test(fieldData)) {
        error[field] =
          "Заголовок должен состоять из букв русского алфавита, цифр и знаков препинания!";
        setError({ ...error });
        return;
      }
      if (fieldData.length < 2 || fieldData.length > 40) {
        error[field] =
          "Длина заголовка должна быть не менее 5 символов и не более 40!";
        setError({ ...error });
        return;
      }
      error[field] = "";
      setError({ ...error });
      break;
    }
  }
};
