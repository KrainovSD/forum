import { useEffect } from "react";

interface form {
  [key: string]: string;
}

export const useValidation = (
  form: form,
  error: form,
  setError: React.Dispatch<React.SetStateAction<form>>,
  validation: (
    field: string,
    fieldData: string,
    authForm: form,
    error: form,
    setError: React.Dispatch<React.SetStateAction<form>>
  ) => void
) => {
  for (let key in form) {
    useEffect(() => {
      const field = key;
      const fieldData = form[key];
      if (error[key].length > 0)
        validation(field, fieldData, form, error, setError);
    }, [form[key]]);
  }
};
